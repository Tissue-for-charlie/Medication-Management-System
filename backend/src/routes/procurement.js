const express = require('express');
const Joi = require('joi');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/async-handler');
const { idParam } = require('../schemas/common');
const { procurementListQuery, procurementCreateBody, procurementUpdateBody } = require('../schemas/procurement');
const {
    listProcurement,
    getProcurement,
    createProcurement,
    updateProcurement,
    approveProcurement,
    deleteProcurement
} = require('../controllers/procurement');

const router = express.Router();

router.get('/', validate({ query: procurementListQuery }), asyncHandler(listProcurement));
router.post('/', validate({ body: procurementCreateBody }), asyncHandler(createProcurement));
router.get('/:id', validate({ params: idParam }), asyncHandler(getProcurement));
router.put('/:id', validate({ params: idParam, body: procurementUpdateBody }), asyncHandler(updateProcurement));
router.post('/:id/approve', validate({ params: idParam, body: Joi.object({}).optional() }), asyncHandler(approveProcurement));
router.delete('/:id', validate({ params: idParam }), asyncHandler(deleteProcurement));

module.exports = { router };
