// First example

// const winston = require('winston')
// const logger = winston.createLogger(
//   {
//     format: winston.format.json(),      // επιστρέφει json
//     transports: [                       // array δηλώνω που θα διοχετεύσω αυτό το log (αρχείο, βάση, console κλπ)
//       new winston.transports.Console()  // json σε console.log
//     ]
//   }
// )


// Second Example

// const { format, createLogger, transports } = require("winston")
// const  { combine, timestamp, label, printf} = format
// const CATEGORY = "Products app logs"

// const customFormat = printf(({level, message, label, timestamp}) => {
//   return `${timestamp} [${label}: Level: ${level}, Message: ${message}]`
// })

// const logger = createLogger({
//   // level: "warn", καλύτερα να φαίνεται στον κώδικα όμως
//   format: combine(
//     label({label: CATEGORY}),
//     timestamp(),
//     customFormat
//   ),
//   transports: [
//     new transports.Console()
//   ]
// })


// Third example

require('winston-daily-rotate-file')
require('winston-mongodb')
const { format, createLogger, transports } = require("winston")
const  { combine, timestamp, label, printf, prettyPrint} = format
const CATEGORY = "Products app logs"

const fileRotateTransport = new transports.DailyRotateFile({
  // Δηλώνω όνομα αρχείου και που να είναι
  filename: "./logs/rotate-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  // Κάθε πόσο να ενημερώνεται
  maxFiles: "7d",
  level:"error"
})

const logger = createLogger({
  format: combine(
    label({label: "MY LABEL FOR PRODUCTS APP"}),
    timestamp({format: "DD-MM-YYYY HH:mm:ss"}),
    format.json()
    // prettyPrint()
  ),
  transports:[
    new transports.Console(),
    fileRotateTransport,    // 1o αρχείο
    new transports.File(    // 2ο αρχείο
      {
        filename:"./logs/example.log"
      }
    ),
    new transports.File(    // 3o αρχείο μόνο warn
      {
        level: "warn",  
        filename:"logs/warn.log"

      }
    ),
    new transports.File(
      {
        level: "info",
        filename: "logs/info.log"
      }
    ),
    new transports.MongoDB(
      { 
        level: "warn",
        db: process.env.MONGODB_URI,
        collection: "server_logs",
        format: format.combine(
          format.timestamp(),
          format.json()
        )
      }
    )
  ]
})

module.exports = logger