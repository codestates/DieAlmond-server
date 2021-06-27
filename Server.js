const express = require('express')


const app = express()
app.get('/', (req,res)=>{res.send('Hello world')})
app.post('/', (req,res)=>{res.send('post hello')})
app.listen(4000,()=>{console.log("port 4000")})