const express = require('express')
const Condition = require('../Controller/Condition')
const ConditionSubmit = require('../Controller/ConditionSubmit')

const ConditionRouter = express.Router();


ConditionRouter.get('/',(req,res)=>res.send('get Condition'))
ConditionRouter.patch('/',(req,res)=>res.send('patch Condition'))

module.exports = ConditionRouter
