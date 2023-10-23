# Social Media API Documentation

## Introduction
This API serves as the backend for a social media website. It provides various endpoints to interact with posts, followers, and user-related functionalities.

## Features
- **User Authentication:** Secure user sign-up and sign-in using JSON Web Tokens (JWT).
- **Posts:** Create, update, delete, and retrieve posts. Like and unlike posts.
- **Followers:** Follow and unfollow other users. Get a list of all your followers.
- **User Management:** Sign-up, sign-in, retrieve user data, and user profiles.

## Technologies Used
- **Backend Language:** Node.js with Express.js.
- **Database:** MongoDB for data storage.
- **Authentication:** JSON Web Tokens (JWT) stored as cookies on the client side.
- **Styling:** Tailwind CSS.

## API Endpoints
- **POST /api/signup:** Sign up a new user.
- **POST /api/signin:** Sign in an existing user to obtain JWT.
- **GET /api/user/:userId:** Retrieve user data.
- **GET /api/user/profile/:userId:** Retrieve user profile.
- **POST /api/post/create:** Create a new post.
- **PUT /api/post/update/:postId:** Update an existing post.
- **DELETE /api/post/delete/:postId:** Delete a post.
- **GET /api/post/following/:userId:** Get posts of all followers.
- **POST /api/post/like/:postId:** Like a post.
- **DELETE /api/post/unlike/:postId:** Unlike a post.
- **POST /api/follow/:userId:** Follow a user.
- **DELETE /api/unfollow/:userId:** Unfollow a user.
- **GET /api/followers/:userId:** Get a list of all user followers.

## Getting Started
1. Clone this repository to your local machine.
2. Run `npm install` to install the required dependencies.
3. Set up your MongoDB connection by modifying the `.env` file.
4. Run `npm start` to start the server.

## Usage
- Ensure you have valid JWT obtained through sign-in or sign-up.
- Use Postman or any API client to test the endpoints.
- Make requests to the respective endpoints for user management, post handling, and followers.

## Author
[Your Name]

## License
This project is licensed under the [License Name] License.

## Acknowledgments
- [Any acknowledgments or references to libraries used]

Feel free to add more details and customize the README according to your project's specific needs.
