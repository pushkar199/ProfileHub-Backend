const express = require('express')
const router = express.Router()
const {register,login,allUsers,profile,updateProfile,uploadPhoto} = require('../controller/user')
const { verifyToken } = require('../middleware/middleware')

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, profile); 
router.get('/allUser', verifyToken, allUsers);
router.put('/update', verifyToken, updateProfile); 
router.post('/photo', verifyToken, uploadPhoto);




module.exports = router