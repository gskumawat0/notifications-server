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

server.listen(process.env.PORT, ()=>{
    console.log(`server is listion on port: ${process.env.PORT}`)
})