const express = require('express')
const Contact = require('../Controller/Contact')
const ContactDelete = require('../Controller/ContactDelete')
const ContactAdd = require('../Controller/ContactAdd')
const ContactTimeReset = require('../Controller/ContactTimeReset')

const ContactRouter = express.Router();

ContactRouter.get('/',(req,res)=>res.send('get Contact'))
ContactRouter.patch('/delete',(req,res)=>ContactDelete(req,res))
ContactRouter.patch('/add',(req,res)=>ContactAdd(req,res))
ContactRouter.patch('/reset',(req,res)=>ContactTimeReset(req,res))

module.exports = ContactRouter
