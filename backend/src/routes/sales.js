const express = require('express');
const Joi = require('joi');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/async-handler');
const { idParam } = require('../schemas/common');
const { salesListQuery, saleCreateBody, saleUpdateBody } = require('../schemas/sales');
const { listSales, getSale, createSale, updateSale, approveSale, deleteSale } = require('../controllers/sales');

const router = express.Router();

router.get('/', validate({ query: salesListQuery }), asyncHandler(listSales));
router.post('/', validate({ body: saleCreateBody }), asyncHandler(createSale));
router.get('/:id', validate({ params: idParam }), asyncHandler(getSale));
router.put('/:id', validate({ params: idParam, body: saleUpdateBody }), asyncHandler(updateSale));
router.post('/:id/approve', validate({ params: idParam, body: Joi.object({}).optional() }), asyncHandler(approveSale));
router.delete('/:id', validate({ params: idParam }), asyncHandler(deleteSale));

module.exports = { router };