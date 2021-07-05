const express = require('express')
const Condition = require('../Controller/Contact&Condition/Condition')
const ConditionSubmit = require('../Controller/Contact&Condition/ConditionSubmit')

const ConditionRouter = express.Router();


ConditionRouter.get('/',Condition)
ConditionRouter.patch('/',ConditionSubmit)

module.exports = ConditionRouter
