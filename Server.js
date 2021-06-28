const express = require('express')
const mongoose = require('mongoose')
const BucketRouter  = require('./Route/BucketRouter.js')   //route
const ConditionRouter = require('./Route/ConditionRouter.js')
const ContactRouter = require('./Route/ContactRouter.js')
const MypageRouter = require('./Route/MypageRouter.js')  
require('dotenv').config()



const app = express()
app.get('/', (req,res)=>{res.send('Hello world')})
app.post('/', (req,res)=>{res.send('post hello')})

app.use('/bucket', BucketRouter)
app.use('/condition', ConditionRouter)
app.use('/contact', ContactRouter)
app.use('/mypage', MypageRouter)


//monogodb connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('mongo connect'))
.catch((err) => console.log("CATCH ERROR", err))



app.listen(80,()=>{console.log('open 80 port')})