const express = require('express')
const mongoose = require('mongoose')
const BucketRouter = require('./Route/BucketRouter.js')   //route
const ConditionRouter = require('./Route/ConditionRouter.js')
const ContactRouter = require('./Route/ContactRouter.js')
const MypageRouter = require('./Route/MypageRouter.js')
const cors = require('cors')
//라우팅

const GetMain = require('./Controller/Main')
const Setting = require('./Controller/Setting')
const Signout = require('./Controller/SignOut')
const WithDrawal = require('./Controller/WithDrawal.js')


// const Facebook = require('./Controller/SnsLogin/Facebook')
// const Github = require('./Controller/SnsLogin/Github')
const Google = require('./Controller/SnsLogin/Google')
const Kakao = require('./Controller/SnsLogin/Kakao')
// const Naver = require('./Controller/SnsLogin/Naver')

//소셜 로그인 컨트롤러

require('dotenv').config()



const app = express()
app.use(express.json())
app.use(cors({
    origin: 'https://www.diealmond.shop',
    credentials: true,
    method: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS']
}))
app.get('/', (req, res) => { res.send('Hello world') })
app.post('/', (req, res) => { res.send('post hello') })
// 테스트용 

app.post('/kakao', Kakao)
app.post('/google', Google)


app.use('/bucket', BucketRouter)
app.use('/condition', ConditionRouter)
app.use('/contact', ContactRouter)
app.use('/mypage', MypageRouter)
// 해당 하는 모든 요청을 파라미터로 라우팅

app.get('/main', GetMain)
app.get('/signout', Signout)
app.post('/setting', Setting)
app.delete('/withdrawal', WithDrawal)

// 

//monogodb connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('mongo connect'))
    .catch((err) => console.log("CATCH ERROR", err))



app.listen(80, () => { console.log('open 80 port') })