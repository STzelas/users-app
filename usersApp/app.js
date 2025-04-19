const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json()) // Όταν θέλουμε το express να διαβάσει json να στείλει
app.use(express.urlencoded({extended:false}))

const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./swagger')

const user = require('./routes/users.routes')
const userProduct = require('./routes/user.products.routes')
const authentication = require('./routes/auth.routes')


app.use(cors({
  origin: ['http://localhost:3000']
}))

app.use('/api/auth', authentication)
app.use('/api/users', user)
app.use('/api/user-product', userProduct)  // Στα endpoint εδώ βάζουμε -

app.use('/', express.static('files'))

// Βρίσει ενα endpoint και ξεκινάει ενα server για τον swagger,
// και εμφανίζει ότι έχει μεσα το αρχείο swaggerDocument
// το οποίο έχει μέσα το options
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument.options))

module.exports = app