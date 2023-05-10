const express = require('express')
const app = express()
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes')
const connetToMongo = require('./config/db');

connetToMongo()

require('dotenv')

app.use(express.json())

const Allowed_Origins = process.env.ALLOWED_ORIGINS.split(', ');
console.log(Allowed_Origins);
app.use(cors({ origin: Allowed_Origins }))

const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
    res.send(`Server is running on PORT ${PORT}..... <a href="http://localhost:3000">Click here</a> to visit FrontEnd`)
})

app.use('/api/user', userRoutes)
app.use('/api/test',testRoutes)

app.listen(PORT, (err) => {
    if (err) throw new Error(err.message)
    console.log("Server is ruuning...")
})