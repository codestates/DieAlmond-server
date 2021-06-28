const express = require('express')
const GetMypage = require('../Controller/GetMyPage')
const PatchMypage = require('../Controller/PatchMypage')

const MypageRouter = express.Router();

MypageRouter.get('/',(req,res)=>res.send('getMyapge'))
MypageRouter.patch('/',(req,res)=>res.send('patchMypage'))

module.exports = MypageRouter