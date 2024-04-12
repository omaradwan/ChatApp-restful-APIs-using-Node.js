## Chat Application

This is a chat application built using Node.js, Express.js, MongoDB with Mongoose, and WebSocket communication using Socket.io. It supports private chat between users and group chat with them and admins in group chat can create links and send them to other users to be able to chat in the group.

## Overview

- **Data Storage:** Leveraged MongoDB with Mongoose for robust data management.
- **Security Measures:** Implemented parameterized queries with MongoDB and employed bcrypt for password hashing. JWT tokens have a short lifespan of 3 hour for heightened security.
- **User Authentication and Access Control:** Enforced authentication and authorization protocols across all endpoints, prioritizing safeguarding sensitive data.
- **File Management:** Integrated Multer for efficient file handling, with stringent authorization measures in diskStorage functions for enhanced security.
- **Email Integration:** Utilized the Nodemailer API for seamless email communication within the application and send confirmation messages for new users Registers.
- **Real-time Messaging:** Leveraged socket.io to facilitate websocket requests, ensuring real-time delivery of messages to recipients.

## API Documentaion



## Getting Started
- Clone the repository to your local machine.
- Install the necessary dependencies using `npm install`.


