require('dotenv').config()
const express=require('express');
const ejs=require('ejs');
const expressLayout=require('express-ejs-layouts');
const path=require('path')
const mongoose=require('mongoose')
const Emitter=require('events')





const app=express();
const session=require('express-session')
const flash=require('express-flash')
 const MongoDbStore=require('connect-mongo')
 const passport=require('passport')
//database Collection
const mongoUri="mongodb://localhost:27017/pizza?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const connectToMongoo =()=>{
    mongoose.connect(mongoUri,()=>{
        console.log("mogo is successfully connect");
    })
}
connectToMongoo();
//event emitter
const eventEmitter=new Emitter();
app.set('eventEmitter',eventEmitter)
//Session Config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
       mongoUrl:mongoUri
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))
app.use(flash());
//passport config
const passportInit=require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
const PORT=process.env.PORT||3000;

//asset
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
//global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session
    res.locals.user=req.user
   
    
    next()
})
//layout
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs');

//routes
require('./routes/web')(app)
app.use((req, res)=>{
  res.status(404).send('<h1>404,page not found<h1>')
})

const server=app.listen(PORT,()=>{
    console.log(`listening on port  ${PORT}`)
})

//socket

const io=require('socket.io')(server)

io.on('connection',(socket)=>{
    //join 
    
    socket.on('join',(orderId)=>{
        
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})