const express = require('express')
const app  = express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
require('dotenv').config()
const PORT = process.env.PORT || 3001;

// Connect to MongoDB database using Mongoose
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err))


app.use(express.json()) // Middleware for parsing JSON bodies

app.use('/', userRoutes)

app.get( '/', (req, res) => {
    res.send(`Welcome to the Home Page! <br/>Accessed on ${new Date()}`)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


