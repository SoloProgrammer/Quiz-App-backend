const express = require('express')
const app = express()
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const connetToMongo = require('./config/db');

connetToMongo()

require('dotenv')

app.use(express.json())


const Allowed_Origins = process.env.ALLOWED_ORIGINS.split(', ');
app.use(cors({ origin: Allowed_Origins }))

const router = express.Router()

const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
    res.send("Hello")
})

app.use('/api/user', userRoutes)

app.listen(PORT, (err) => {
    if (err) throw new Error(err.message)
    console.log("Server is ruuning...")
})