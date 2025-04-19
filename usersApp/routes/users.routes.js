const express = require('express')

const router = express.Router()

const userController = require('../controllers/user.controller')
const verifyToken = require('../middlewares/auth.middleware').verifyToken
const verifyRoles = require('../middlewares/auth.middleware').verifyRoles

router.get('/', verifyToken, userController.findAll)
router.get('/:username', userController.findOne)
router.post('/', verifyToken, verifyRoles("ADMIN"), userController.create)  // Να γινει verify το auth token στο post route
router.patch('/:username', verifyToken, verifyRoles("ADMIN"), userController.update)
router.delete('/:username', verifyToken, verifyRoles("ADMIN"), userController.deleteByUsername)
router.delete('/:username/email/:email', verifyToken, verifyRoles("ADMIN"), userController.deleteByEmail)
module.exports = router