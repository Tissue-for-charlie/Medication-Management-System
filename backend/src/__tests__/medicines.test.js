// Mock pool before requiring controller
const mockExecute = jest.fn();
jest.mock('../db/pool', () => ({
  pool: { execute: mockExecute, getConnection: jest.fn() }
}));
jest.mock('../services/lookup', () => ({
  getCategoryIdByName: jest.fn().mockResolvedValue(1)
}));

const { listMedicines, getMedicine, createMedicine, updateMedicine, deleteMedicine } = require('../controllers/medicines');

describe('medicines controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    req = { query: { page: 1, pageSize: 10 } };
  });

  describe('listMedicines', () => {
    it('should return paginated medicines', async () => {
      mockExecute
        .mockResolvedValueOnce([[{ c: 25 }], []])         // COUNT
        .mockResolvedValueOnce([[{ id: 1, name: 'Test' }], []]); // SELECT

      await listMedicines(req, res);

      expect(mockExecute).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(Array),
          pagination: expect.objectContaining({ page: 1, pageSize: 10, total: 25, totalPages: 3 })
        })
      );
    });

    it('should filter by search', async () => {
      req.query.search = '阿莫西林';
      mockExecute
        .mockResolvedValueOnce([[{ c: 0 }], []])
        .mockResolvedValueOnce([[[], []]]);

      await listMedicines(req, res);

      const [[, args]] = mockExecute.mock.calls[0];
      expect(args[0]).toBe('%阿莫西林%');
    });
  });

  describe('getMedicine', () => {
    it('should return a single medicine', async () => {
      req.params = { id: 1 };
      mockExecute.mockResolvedValueOnce([[{ id: 1, name: 'Test' }], []]);

      await getMedicine(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: { id: 1, name: 'Test' } });
    });

    it('should throw 404 when not found', async () => {
      req.params = { id: 999 };
      mockExecute.mockResolvedValueOnce([[[], []]]);

      await expect(getMedicine(req, res)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('createMedicine', () => {
    it('should create and return new medicine', async () => {
      req.body = {
        code: 'YP001', name: 'TestDrug', category: '维生素类',
        spec: '10mg', price: 9.9, stock: 100, expire: '2027-01-01', maker: 'TestMaker'
      };
      mockExecute
        .mockResolvedValueOnce([{ insertId: 99 }, []])
        .mockResolvedValueOnce([[{ id: 99, name: 'TestDrug' }], []]);

      await createMedicine(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: { id: 99, name: 'TestDrug' } });
    });

    it('should throw 409 on duplicate', async () => {
      req.body = { code: 'DUP', name: 'Dup', category: '维生素类', spec: 'x', price: 1, stock: 10, expire: '2027-01-01', maker: 'M' };
      const dupError = new Error('Duplicate');
      dupError.code = 'ER_DUP_ENTRY';
      mockExecute.mockRejectedValueOnce(dupError);

      await expect(createMedicine(req, res)).rejects.toMatchObject({ status: 409 });
    });
  });

  describe('updateMedicine', () => {
    it('should update and return medicine', async () => {
      req.params = { id: 1 };
      req.body = { price: 12.5 };
      mockExecute
        .mockResolvedValueOnce([{ affectedRows: 1 }, []])
        .mockResolvedValueOnce([[{ id: 1, name: 'Updated' }], []]);

      await updateMedicine(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: { id: 1, name: 'Updated' } });
    });
  });

  describe('deleteMedicine', () => {
    it('should delete a medicine with no orders', async () => {
      req.params = { id: 1 };
      mockExecute
        .mockResolvedValueOnce([[{ c: 0 }], []])  // procurement check
        .mockResolvedValueOnce([[{ c: 0 }], []])  // sales check
        .mockResolvedValueOnce([{ affectedRows: 1 }, []]);

      await deleteMedicine(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: true });
    });

    it('should throw 409 when medicine has orders', async () => {
      req.params = { id: 1 };
      mockExecute
        .mockResolvedValueOnce([[{ c: 3 }], []]);

      await expect(deleteMedicine(req, res)).rejects.toMatchObject({ status: 409 });
    });
  });
});
