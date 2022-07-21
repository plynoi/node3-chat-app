///*|----------------------------------------------------------------------------------------------------
// *|            This source code is provided under the MIT license      	--
// *|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
// *|                See the project's LICENSE.md for details.                  					--
// *|           Copyright (C) 2022 Wasin W. All rights reserved.            		--
///*|----------------------------------------------------------------------------------------------------

// Socket.io
const socket = io()
// Form and Element
const $messageForm = document.querySelector('#message-form') //$ is just a code convention
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


// Options
const { username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})

// Auto scrolling code
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Heigh of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom) //Get the margin
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin //Margin + Height of the element

    //Visible Height
    const visibleHeight = $messages.offsetHeight

    //Total Height of the container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight
    //Check if we are at the bottom (exclude new message)
    if(containerHeight - newMessageHeight <= scrollOffset){ 
        $messages.scrollTop = $messages.scrollHeight
    }

}

// get 'onMessage' callback from the WebSocket connection.
socket.on('onMessage', (message) => {
    console.log(message)
    //Get message HTML template and render
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    //Insert to main page
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

// get 'locationMessage' callback from the WebSocket connection.
socket.on('locationMessage', (message) => {
    //console.log(message)
    //Get location HTML template and render
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        mapURL: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    //Insert to main page
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

// get 'roomData' callback from the WebSocket connection. For printing room data
socket.on('roomData', ({room, users})=> {
    //Get room HTML template and render
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    console.log('roomData')
    $sidebar.innerHTML = html
})

//Send message to WebSocket
$messageForm.addEventListener('submit', (event)=>{

    event.preventDefault()
    //disable form
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = event.target.elements.message.value
    if(message.length !== 0){
        //console.log(`Client message: ${message}`)
        socket.emit('sendMessage', message, (error) => { //callback when server receives event
            $messageFormButton.removeAttribute('disabled')
            $messageFormInput.value = ''
            $messageFormInput.focus()
            if (error){
                return console.log(error)
            } 
            console.log('Message delivered!')
        })
    } else {
        console.log('Please input a message!')
    }
})

//Send location to WebSocket
$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browsers')
    }

    //disable
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position)
        $sendLocationButton.removeAttribute('disabled')
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        })
    })
})

// Get 'join' join room WebSocket event
socket.emit('join', {username, room}, (error) => {
    //if no error, it means user has joined the room

    if(error){
        alert(error)
        location.href = "/" //Back to main page
    }
})