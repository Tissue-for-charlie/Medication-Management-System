const mockExecute = jest.fn();
const mockGetConnection = jest.fn();
jest.mock('../db/pool', () => ({
  pool: { execute: mockExecute, getConnection: mockGetConnection }
}));
jest.mock('../services/lookup', () => ({
  getMedicineIdByName: jest.fn().mockResolvedValue(1)
}));

const { listSales, getSale, approveSale, deleteSale } = require('../controllers/sales');

describe('sales controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    req = { query: { page: 1, pageSize: 10 } };
  });

  describe('listSales', () => {
    it('should return paginated sales', async () => {
      mockExecute
        .mockResolvedValueOnce([[{ c: 30 }], []])
        .mockResolvedValueOnce([[{ id: 1, code: 'SO1' }], []]);

      await listSales(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(Array),
          pagination: expect.objectContaining({ total: 30 })
        })
      );
    });
  });

  describe('getSale', () => {
    it('should return a single sale', async () => {
      req.params = { id: 1 };
      mockExecute.mockResolvedValueOnce([[{ id: 1, code: 'SO1' }], []]);

      await getSale(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: { id: 1, code: 'SO1' } });
    });
  });

  describe('approveSale', () => {
    it('should approve and deduct stock', async () => {
      req.params = { id: 1 };
      const mockConn = {
        execute: jest.fn(),
        beginTransaction: jest.fn().mockResolvedValue(),
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
        release: jest.fn()
      };
      mockGetConnection.mockResolvedValue(mockConn);
      mockExecute.mockResolvedValueOnce([[{ medicine_id: 1, qty: 10, status: '待确认' }], []]);
      mockConn.execute
        .mockResolvedValueOnce([])  // SELECT FOR UPDATE - stock 100
        .mockResolvedValueOnce([[{ stock: 100 }], []])
        .mockResolvedValueOnce([])  // update order status
        .mockResolvedValueOnce([]); // update stock

      await approveSale(req, res);

      expect(mockConn.commit).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ data: true });
    });

    it('should reject insufficient stock', async () => {
      req.params = { id: 1 };
      const mockConn = {
        execute: jest.fn(),
        beginTransaction: jest.fn().mockResolvedValue(),
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
        release: jest.fn()
      };
      mockGetConnection.mockResolvedValue(mockConn);
      mockExecute.mockResolvedValueOnce([[{ medicine_id: 1, qty: 999, status: '待确认' }], []]);

      await expect(approveSale(req, res)).rejects.toMatchObject({ status: 400 });
    });
  });

  describe('deleteSale', () => {
    it('should delete a sale', async () => {
      req.params = { id: 1 };
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }, []]);

      await deleteSale(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: true });
    });
  });
});
