import express from 'express';
const router = express.Router();

import {posted, getDetails, update, signUp, updateById } from '../controllers/test'

router.post('/posted', posted)
router.get('/getDetails', getDetails)
router.post('/update', update)
router.post('/signUp', signUp)
// router.post('/signIn', signIn)
router.post('/updateById', updateById)

export {router}
