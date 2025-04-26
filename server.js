const mongoose = require('mongoose') // library for the database
const app = require('./app')  // import απο το app.js, το app που εκανα export
const port = 3000

// Το connection string απο το Compass
// Εκεί που συνδέεται η βάση είναι.
// retryWrites και w=majority σημαίνουν ότι αν δεν συνδεθεί, θα προσπαθεί ξανα και ξανά μέχρι να συνδεθεί και δεν θα πεταξει ερρορ
mongoose.connect(process.env.MONGODB_URI)   
        .then(                  // thenables  / promise
          () => {
            console.log("Connection to mongoDB established")

            app.listen(port, () => {
              console.log(`Server on port ${port} is up and running...`)
            })
            
          },
          err => { console.log('Failed to connect to mongoDB',err)}
        )


