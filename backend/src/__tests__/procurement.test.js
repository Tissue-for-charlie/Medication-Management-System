const mockExecute = jest.fn();
const mockGetConnection = jest.fn();
jest.mock('../db/pool', () => ({
  pool: { execute: mockExecute, getConnection: mockGetConnection }
}));
jest.mock('../services/lookup', () => ({
  getMedicineIdByName: jest.fn().mockResolvedValue(1),
  getSupplierIdByName: jest.fn().mockResolvedValue(1)
}));

const { listProcurement, getProcurement, approveProcurement, deleteProcurement } = require('../controllers/procurement');

describe('procurement controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    req = { query: { page: 1, pageSize: 10 } };
  });

  describe('listProcurement', () => {
    it('should return paginated procurement orders', async () => {
      mockExecute
        .mockResolvedValueOnce([[{ c: 10 }], []])
        .mockResolvedValueOnce([[{ id: 1, code: 'PO1' }], []]);

      await listProcurement(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(Array),
          pagination: expect.objectContaining({ total: 10 })
        })
      );
    });
  });

  describe('getProcurement', () => {
    it('should return a single order', async () => {
      req.params = { id: 1 };
      mockExecute.mockResolvedValueOnce([[{ id: 1, code: 'PO1' }], []]);

      await getProcurement(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: { id: 1, code: 'PO1' } });
    });

    it('should throw 404 when not found', async () => {
      req.params = { id: 999 };
      mockExecute.mockResolvedValueOnce([[[], []]]);

      await expect(getProcurement(req, res)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('approveProcurement', () => {
    it('should approve and update stock', async () => {
      req.params = { id: 1 };
      const mockConn = {
        execute: jest.fn(),
        beginTransaction: jest.fn().mockResolvedValue(),
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
        release: jest.fn()
      };
      mockGetConnection.mockResolvedValue(mockConn);
      mockExecute.mockResolvedValueOnce([[{ medicine_id: 1, qty: 100, status: '待审核' }], []]);
      mockConn.execute
        .mockResolvedValueOnce([])  // update order
        .mockResolvedValueOnce([[{ stock: 50 }], []])  // SELECT FOR UPDATE
        .mockResolvedValueOnce([]);  // update stock

      await approveProcurement(req, res);

      expect(mockConn.beginTransaction).toHaveBeenCalled();
      expect(mockConn.commit).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ data: true });
    });

    it('should reject non-pending orders', async () => {
      req.params = { id: 1 };
      mockExecute.mockResolvedValueOnce([[{ medicine_id: 1, qty: 100, status: '已审核' }], []]);

      await expect(approveProcurement(req, res)).rejects.toMatchObject({ status: 400 });
    });
  });

  describe('deleteProcurement', () => {
    it('should delete an order', async () => {
      req.params = { id: 1 };
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }, []]);

      await deleteProcurement(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: true });
    });
  });
});
