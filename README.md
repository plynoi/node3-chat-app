# Node.js WebSocket Chat Application Example
- version: 1.0.0
- Last update: Jul 2022
- Environment: Windows WSL
- Prerequisite: [Nodejs and Internet connection](#prerequisite)

## <a id="intro"></a>Introduction

This is an example project from [Udemy](https://www.udemy.com/)'s [The Complete Node.js Developer Course (3rd Edition)](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) course.

This Node.js WebSocket server chat application lets you create chat rooms and join multiple users to send messages, and locations in real-time.

The technologies and services under the hood are as follows:
* [ExpressJS](https://expressjs.com/) web application framework.
* [Socket.io](https://socket.io/) client-server WebSocket library.

## <a id="prerequisite"></a>Prerequisite
1. [Node.js](https://nodejs.org/en/) runtime with [NPM](https://www.npmjs.com/).
2. Internet connection

## <a id="running"></a>How To Run 

1. Install application dependencies with the following command.
    ```
    $> npm install
    ```
2. Once the installation process is successful, run the application with the following command
    ```
    $> npm run start
    ```
3. Open the **http://localhost:3000/** URL in your web browser.
4. Input your preferred username, and room name.
5. Open other browser tabs (or windows), and open the **http://localhost:3000/** URL.
6. Input your preferred username, and *4*'s room name.


## <a id="author"></a>Author

Author: Wasin Waeosri ([plynoi.com](https://plynoi.com/))