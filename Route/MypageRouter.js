const express = require('express')
const GetMypage = require('../Controller/GetMyPage')
const PatchMypage = require('../Controller/PatchMypage')

const MypageRouter = express.Router();

MypageRouter.get('/',GetMypage)
MypageRouter.patch('/',PatchMypage)

module.exports = MypageRouter