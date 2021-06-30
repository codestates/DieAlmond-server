const express = require('express')
const Condition = require('../Controller/Condition')
const ConditionSubmit = require('../Controller/ConditionSubmit')

const ConditionRouter = express.Router();


ConditionRouter.get('/',Condition)
ConditionRouter.patch('/',ConditionSubmit)

module.exports = ConditionRouter
