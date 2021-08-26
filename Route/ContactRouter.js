const express = require('express')
const Contact = require('../Controller/Contact&Condition/Contact')
const ContactDelete = require('../Controller/Contact&Condition/ContactDelete')
const ContactAdd = require('../Controller/Contact&Condition/ContactAdd')
const ContactTimeReset = require('../Controller/Contact&Condition/ContactTimeReset')

const ContactRouter = express.Router();

ContactRouter.get('/',Contact)
ContactRouter.patch('/delete',ContactDelete)
ContactRouter.patch('/add',ContactAdd)
ContactRouter.patch('/reset',ContactTimeReset)

module.exports = ContactRouter
