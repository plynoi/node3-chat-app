///*|----------------------------------------------------------------------------------------------------
// *|            This source code is provided under the MIT license      	--
// *|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
// *|                See the project's LICENSE.md for details.                  					--
// *|           Copyright (C) 2022 Wasin W. All rights reserved.            		--
///*|----------------------------------------------------------------------------------------------------

const users = []

// Add user to users
const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

// remove user based on their id
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1){
        return users.splice(index, 1)[0] // splice remove item from array from a specific index
    }
}

// get user from id
const getUser = (id) => {
    const userResult = users.find((user) => {
        return user.id === id
    })

    return userResult
}

// get all users in the room
const getUsersInRoom = (room) => {
    const usersInRoom = users.filter((user) => { //Get all element, find() return just the first one
        return user.room === room
    })
    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

