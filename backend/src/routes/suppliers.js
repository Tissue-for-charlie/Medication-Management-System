const express = require('express');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/async-handler');
const { idParam } = require('../schemas/common');
const { suppliersListQuery, supplierCreateBody, supplierUpdateBody } = require('../schemas/suppliers');
const { listSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/suppliers');

const router = express.Router();

router.get('/', validate({ query: suppliersListQuery }), asyncHandler(listSuppliers));
router.post('/', validate({ body: supplierCreateBody }), asyncHandler(createSupplier));
router.get('/:id', validate({ params: idParam }), asyncHandler(getSupplier));
router.put('/:id', validate({ params: idParam, body: supplierUpdateBody }), asyncHandler(updateSupplier));
router.delete('/:id', validate({ params: idParam }), asyncHandler(deleteSupplier));

module.exports = { router };
