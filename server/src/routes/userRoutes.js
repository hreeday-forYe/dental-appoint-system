import express from 'express'
import { activateUser, loginUser, logoutUser, registerUser, updateUserInfo } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/activate', activateUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout', isAuthenticated, logoutUser)
userRouter.put('/update-profile', isAuthenticated, updateUserInfo)

export default userRouter;