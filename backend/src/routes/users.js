const express = require('express');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/async-handler');
const { idParam } = require('../schemas/common');
const { usersListQuery, userCreateBody, userUpdateBody } = require('../schemas/users');
const { listUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');

const router = express.Router();

router.get('/', validate({ query: usersListQuery }), asyncHandler(listUsers));
router.post('/', validate({ body: userCreateBody }), asyncHandler(createUser));
router.get('/:id', validate({ params: idParam }), asyncHandler(getUser));
router.put('/:id', validate({ params: idParam, body: userUpdateBody }), asyncHandler(updateUser));
router.delete('/:id', validate({ params: idParam }), asyncHandler(deleteUser));

module.exports = { router };
