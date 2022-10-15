## Make Tour BD

Make tour bd is a tour planning back-end application for general user, guides and admins.

## Key Features

**Authentication & Autherization :**

- Sign in with JWT authentication
- Role based Sing up
- Update user profile
- Forget password
- Get user information

**Tour :**

- Get all active tours (for all users)
- Get a single tour (for all users)
- Create new tour (for admins)
- Delete new tour (for admins)
- Update tour information (for admins and guides)

**Ratting & Review :**

- Get all reviews (for general users)
- Get a single review (for general users)
- Give/Post a ratting and review (for general users)
- Update review (for general users)
- Delete review (for general users and admins)

**Security :**

- JWT authentication
- Protected route
- Add Rate limit for api hit
- Data sanitization against NoSQL query injection
- Data sanitization against xss
- Prevent parameter pollution

## Installation

1. Download and Install Visual Studion code, node Js, git and mongo DB in your machine.
2. Download and install mongo db compass.
3. Open VS code and its terminal run <code>git clone https://github.com/MizanurRahmann/maketour-bd.git</code>
4. Install nodemon globally by running <code>npm i -g nodemon</code>
5. Run <code>npm install</code>
6. Run <code>npm start</code> to run the application

## Used Tools
- Node
- Express
- Mongo DB
- Mongoose
- Helmet
- Json Web Token
- Validator
- Nodemailer
- XSS-clean

## Acknowledgement
This project is part of the online course I've taken at Udemy. Thanks to Jonas Schmedtmann for creating this awesome course.
