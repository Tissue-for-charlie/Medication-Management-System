const express = require('express');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/async-handler');
const { idParam } = require('../schemas/common');
const { categoriesListQuery, categoryCreateBody, categoryUpdateBody } = require('../schemas/categories');
const { listCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categories');

const router = express.Router();

router.get('/', validate({ query: categoriesListQuery }), asyncHandler(listCategories));
router.post('/', validate({ body: categoryCreateBody }), asyncHandler(createCategory));
router.get('/:id', validate({ params: idParam }), asyncHandler(getCategory));
router.put('/:id', validate({ params: idParam, body: categoryUpdateBody }), asyncHandler(updateCategory));
router.delete('/:id', validate({ params: idParam }), asyncHandler(deleteCategory));

module.exports = { router };
