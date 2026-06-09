const express = require('express');
const {
  handleGetAllUsers, 
  handlegetUserById, 
  handleUpdateUserById, 
  handleDeleteUserById, 
  handleCreateNewUser
} = require("../controllers/user");

const router = express.Router();

/**
 * @openapi
 * /user:
 *   get:
 *     tags:
 *       - Employee
 *     summary: Get all employees
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   firstName:
 *                     type: string
 *   post:
 *     tags:
 *       - Employee
 *     summary: Create an employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - gender
 *               - job_title
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               job_title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.route("/")
  .get(handleGetAllUsers)
  .post(handleCreateNewUser);

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags:
 *       - Employee
 *     summary: Get an employee by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 *   patch:
 *     tags:
 *       - Employee
 *     summary: Update an employee's details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               job_title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: User not found
 *   delete:
 *     tags:
 *       - Employee
 *     summary: Delete an employee
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: User not found
 */
router.route("/:id")
  .get(handlegetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
