//npm init creates json file

/*
1. npm install express [ is how we are going to build our API]
2. .write() and .send() difference
3. go to a specific room, create a view, so code first index.html file
4. after installing ejs, Q. what is view engine, view file in ejs 
5. creating a room ID/ a specific ID: 
    UUID library - we need unique id that generates random id 
    to actually have a room ID in link we need to create a new URL 

6. to view our own video we need a script file, set the public url for sccript.js
7. import socket.io here then join the room with event/ here we'll get the room 
specific ID
8. after connectonewuser, how do we identify that user, here comes peerjs and webrtc


Q. what is web rtc/peerjs?





 */



/*//npm init creates json file

/*
1. npm install express [ is how we are going to build our API]
2. .write() and .send() difference
3. go to a specific room, create a view, so code first index.html file
4. after installing ejs, Q. what is view engine, view file in ejs 
5. creating a room ID/ a specific ID: 
    UUID library - we need unique id that generates random id 
    to actually have a room ID in link we need to create a new URL 

6. to view our own video we need a script file, set the public url for sccript.js
7. import socket.io here then join the room with event/ here we'll get the room 
specific ID
8. after connectonewuser, how do we identify that user, here comes peerjs and webrtc


Q. what is web rtc/peerjs?



const express = require ('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const {v4: uuidv4} = require('uuid'); //importing uuid, specifically v4
const {ExpressPeerServer}= require('peer');//is it a class
const peerServer = ExpressPeerServer(server, {
    debug: true 
});


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);
app.get('/', (req, res)=>{
   // res.status(200).send(`hello world`);
  // res.render('room'); //this gives error, we did not install ejs
     res.redirect(`/${uuidv4()}`) //this the root, it will automatically generate a uuid and redirect you to it
     //app.ghet will get the uuid generated and in the res.render room we 
     //are passing roomID to the front, so ejs comes in 
})

app.get('/:room', (req,res)=>{
    res.render('room', {roomId: req.params.room});//pass this roomID to room.ejs
})

io.on('connection', socket =>{
    //when a user joins the room 
    socket.on('join-room', (roomId, userId)=>{
        console.log('in the meeting room');
        //we need to emit the join room, tell the socket that we have joined the room, tell this to room.js
        socket.join(roomId);
        //broadcasts that the user is connected
        //socket.to(roomId).broadcast.emit('user-connected');
        //socket.broadcast.to(roomId).emit('user-connected');
        socket.to(roomId).emit("user-connected", userId);
        
        socket.on('message', message =>{
            io.to(roomId).emit('createMessage', message)
        })
    })
})


server.listen(3030, ()=>{
    console.log('hey there, im up and running at port 3030');
})









const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid'); //importing uuid, specifically v4
const { ExpressPeerServer } = require('peer');//is it a class
const peerServer = ExpressPeerServer(server, {
    debug: true
});


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
    // res.status(200).send(`hello world`);
    // res.render('room'); //this gives error, we did not install ejs
    res.redirect(`/${uuidv4()}`) //this the root, it will automatically generate a uuid and redirect you to it
    //app.ghet will get the uuid generated and in the res.render room we 
    //are passing roomID to the front, so ejs comes in 
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });//pass this roomID to room.ejs
})

io.on('connection', socket => {
    //when a user joins the room 
    socket.on('join-room', (roomId, userId) => {
        console.log('in the meeting room');
        //we need to emit the join room, tell the socket that we have joined the room, tell this to room.js
        socket.join(roomId);
        //broadcasts that the user is connected
        //socket.to(roomId).broadcast.emit('user-connected');
        //socket.broadcast.to(roomId).emit('user-connected');
        socket.to(roomId).emit("user-connected", userId);

        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
    })
})


server.listen(3030, () => {
    console.log('hey there, im up and running at port 3030');
})


 */

const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId);
        // messages
        socket.on('message', (message) => {
            //send message to the same room
            io.to(roomId).emit('createMessage', message)
        })

       
    })
})

server.listen(3030);
 