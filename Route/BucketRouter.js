// Allbucket.js
// BucketAdd
// BucketDelete.js
// BucketLike.js
// BucketListCheck

const express = require('express')
const BucketDelete = require('../Controller/BucketDelete')
const AllBucket = require('../Controller/AllBucket')
const MyBucket = require('../Controller/MyBucket')
console.log("MyBucket",MyBucket)
const BucketAdd = require('../Controller/BucketAdd')
const BucketListCheck = require('../Controller/BucketListCheck')
const BucketLike = require('../Controller/BucketLike')

const BucketRouter = express.Router();


BucketRouter.delete('/',(req,res) => res.send('delete Bucket'))
BucketRouter.get('/',(req,res)=> res.send('get Bucket'))
BucketRouter.get('/all',(req,res)=> res.send('get All Bucket'))
BucketRouter.patch('/add',(req,res)=> res.send('patch Add Bucket'))
BucketRouter.patch('/check',(req,res)=> res.send('patch Check Bucket'))
BucketRouter.patch('/like',(req,res)=> res.semd('patch Like Bucket'))

module.exports = BucketRouter


