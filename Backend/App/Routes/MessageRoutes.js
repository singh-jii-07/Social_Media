import express from 'express'

import{sendMessage,getMessage} from '../Controllers/MessageController.js'
import isAuthenticated from '../Middleware/isAuthenticated.js';

const messageRoutes =express.Router();

messageRoutes.post("/send/:id",isAuthenticated,sendMessage)
messageRoutes.get("/all/:id",isAuthenticated,getMessage)

export default messageRoutes