// Allbucket.js
// BucketAdd
// BucketDelete.js
// BucketLike.js
// BucketListCheck

const express = require('express')
const BucketDelete = require('../Controller/BucketDelete')
const AllBucket = require('../Controller/AllBucket')
const MyBucket = require('../Controller/MyBucket')
const BucketAdd = require('../Controller/BucketAdd')
const BucketListCheck = require('../Controller/BucketListCheck')
const BucketLike = require('../Controller/BucketLike')
const MyBucketChecked = require('../Controller/MyBucketChecked')

const BucketRouter = express.Router();


BucketRouter.delete('/',BucketDelete)
BucketRouter.get('/check', MyBucketChecked)
BucketRouter.get('/', MyBucket)
BucketRouter.get('/all',AllBucket)
BucketRouter.patch('/add',BucketAdd)
BucketRouter.patch('/check',BucketListCheck)
BucketRouter.patch('/like',BucketLike)
BucketRouter.use((req, res, next) => {
    res.statusCode = 404;
    res.send({'code':404,'msg':'request could not be found'})
  });

module.exports = BucketRouter


