
# ProfileHub - Server

This project is a simple Express.js API with MongoDB integration and a custom middleware function to track the token and get the user id

# Features
Provides RESTful endpoints for managing Profile.

Utilizes MongoDB for data storage.

Middleware function to verify the token  of incoming requests (JWT).

## Installation

### Clone the repository:

```bash

git clone https://github.com/pushkar199/ProfileHub-Backend.git

```

### Install dependencies:

```bash

cd ProfileHub - Server
npm install

```

### Set up environment variables:

```bash

MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<secret_for_jwt>
PORT=<port_number>

```

## Usage

### Start the server:

```bash

npm start

```

### Access the API endpoints:

- Register Your Account: `POST /register`
- Login into your account: `POST /login`
- View all users: `GET /allUser`
- View my profile: `GET /profile`
- Update your profile: `PUT /update`
- Upload your photo: `POST /photo`




