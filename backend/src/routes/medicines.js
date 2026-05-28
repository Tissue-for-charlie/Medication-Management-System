const express = require('express');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/async-handler');
const { idParam } = require('../schemas/common');
const { medicinesListQuery, medicineCreateBody, medicineUpdateBody } = require('../schemas/medicines');
const { listMedicines, getMedicine, createMedicine, updateMedicine, deleteMedicine } = require('../controllers/medicines');

const router = express.Router();

router.get('/', validate({ query: medicinesListQuery }), asyncHandler(listMedicines));
router.post('/', validate({ body: medicineCreateBody }), asyncHandler(createMedicine));
router.get('/:id', validate({ params: idParam }), asyncHandler(getMedicine));
router.put('/:id', validate({ params: idParam, body: medicineUpdateBody }), asyncHandler(updateMedicine));
router.delete('/:id', validate({ params: idParam }), asyncHandler(deleteMedicine));

module.exports = { router };
