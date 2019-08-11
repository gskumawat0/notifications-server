const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const server = require('http').createServer(app);
const io = require('socket.io')(server);


process.env.NODE_ENV === 'development' && mongoose.set('debug', true);
app.use(bodyparser.json({limit: '5mb', extended: true}));    
app.use(bodyparser.urlencoded({limit: '5mb', extended: true})) 

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
    .then((e) => console.log('connected to db'))
    .catch((err) => console.log(err.message)); 

//cors config
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_APP_BASE_URL);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header('Access-Control-Allow-Credentials', true)
    next();
});

//handle express errors
app.use((err, req, res, next)=>{
    if(err){
        return res.json({
            success: false,
            message:  err.message,
            errCode: err.stack
        })
    }
    next();
})

app.use((req, res, next)=>{
    req.io = io;
    next();
})



io.on('connection', (socket)=>{
    socket.broadcast.emit('add_notification', 'a new user connected')
      
    socket.on('disconnect', () => {
        socket.broadcast.emit('add_notification', 'user logged out')
    })
})

server.listen(process.env.PORT, ()=>{
    console.log(`server is listion on port: ${process.env.PORT}`)
})