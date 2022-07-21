///*|----------------------------------------------------------------------------------------------------
// *|            This source code is provided under the MIT license      	--
// *|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
// *|                See the project's LICENSE.md for details.                  					--
// *|           Copyright (C) 2022 Wasin W. All rights reserved.            		--
///*|----------------------------------------------------------------------------------------------------

const path = require('path')
const http = require('http')
const express = require('express')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app) //Explicitly create raw HTTP server
//const io = new Server(server) //Socket.io supports raw HTTP server only
const io = require('socket.io')(server)

const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, getUser, getUsersInRoom, removeUser} = require('./utils/users')

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname , '../public')

app.set('x-powered-by' , 'Express.js')
// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

let count = 0
const sysAdminUser = 'Admin'

// server (emit) --> client (receive) - countUpdated
// client (emit) --> server (receive) -- increment

io.on('connection', (socket) => { //socket keeps information about a new connection
    console.log('New WebSocket Server')
    // Join Chat event
    socket.on('join', ({username, room}, callback) => {
        // Add users
        const {error, user} = addUser({id: socket.id, username, room})
        if(error){
            return callback(error)
        }

        socket.join(user.room) //Joining Room
        //Send welcome message
        socket.emit('onMessage', generateMessage(sysAdminUser, 'Welcome!'))
        //Send to everybody except the one who initiate a connection
        socket.broadcast.to(user.room).emit('onMessage', generateMessage(
            sysAdminUser,
            `${user.username} has joined!`
        )) 
        
        //Send user detail to room data
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback() //send acknowledge that user can join

        // io.to(<roomname>).emit : Emit message/event to everybody in the specific room
        // socket.broadcast.to(<roomname>).emit : //Send to everybody in the specific room except the one who initiate a connection
    })

    //Send message event
    socket.on('sendMessage', (message, callback) => {
        //Get user 
        const user = getUser(socket.id)
        if(!user){
            //No user
            return callback('Cannot find user')
        }

        //Filter dirty words
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('onMessage', generateMessage(user.username, message)) // send event to all connections

        callback() //send acknowledge
    })
    //Location message event
    socket.on('sendLocation', (position, callback) => {
        //Get user 
        const user = getUser(socket.id)
        if(!user){
            //No user
            return callback('Cannot find user')
        }
        // send event to all connections
        io.to(user.room).emit('locationMessage', generateLocationMessage(
            user.username, 
            `https://google.com/maps?q=${position.latitude},${position.longitude}`
        )) 
            

        callback() //send acknowledge
    })
    //built-in disconnect event to detect client disconnect event
    socket.on('disconnect', () => { 
        const user =removeUser(socket.id)
        if(user){
            io.to(user.room).emit('onMessage',  generateMessage(
                sysAdminUser, 
                `${user.username} has left!!`
            ))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })


})

// Start server
server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})