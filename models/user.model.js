// Το mongoose λειτουργεί σαν mapper των objects
// σε MongoDB documents, και κάνει αυτό 
// τον έλεγχο τον πεδίων
// και όχι η NoSQL βάση δεδομένων
// Ότι έλεγχο θέλουμε να κάνουμε
// πρέπει να γίνει εδώ
const mongoose = require('mongoose')

// Σχήμα
const Schema = mongoose.Schema

// Αυτόματα μπαίνει id. Αν δεν θέλουμε βάζουμε _id: false
let addressSchema = new Schema({
  area: {
    type: String
  },
  road: {
    type: String
  }
},{_id: false})

let phoneSchema = new Schema({
  type: {type: String},
  number: {type: String}
}, {_id:false})

let productsSchema = new Schema({
  product: {type: String},
  cost: {type: Number},
  quantity: {type: Number, required: true},
  date: {type: Date, default: Date.now}
})

let userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is a required field"],
    max: 20,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is a required field"],
    max: 20
  },
  name: {
    type: String,
    required: [true, "Name is a required field"],
    max: 20
  },
  surname: {
    type: String,
    required: [true, "Surname is a required field"],
    max: 20
  },
  email: {
    type: String,
    required: [true, "Email is a required field"],
    max: 20,
    unique: true,
    trim: true,
    lowercase: true
  },
  address: addressSchema,
  phone: {type: [phoneSchema], null: true},
  products: {type: [productsSchema], null: true},
  roles: {type: [String], null: true}
},
{
  collection: 'users',
  timestamps: true  // Για το updated at και το created at
})

module.exports = mongoose.model('User', userSchema)