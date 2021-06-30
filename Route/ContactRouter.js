const express = require('express')
const Contact = require('../Controller/Contact')
const ContactDelete = require('../Controller/ContactDelete')
const ContactAdd = require('../Controller/ContactAdd')
const ContactTimeReset = require('../Controller/ContactTimeReset')

const ContactRouter = express.Router();

ContactRouter.get('/',Contact)
ContactRouter.patch('/delete',ContactDelete)
ContactRouter.patch('/add',ContactAdd)
ContactRouter.patch('/reset',ContactTimeReset)

module.exports = ContactRouter
