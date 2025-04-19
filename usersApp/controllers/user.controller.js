const User = require('../models/user.model')
const userService = require("../services/user.services")
const bcrypt = require('bcrypt')
const logger = require('../logger/logger')

exports.findAll = async(request, response) => {
  console.log("Find All users from collection users")

  try{
    // const result = await User.find()
    const result = await userService.findAll()
    response.status(200).json({
      status: true,
      data: result
    })
    logger.info("Success in reading all users")
    // logger.warn("Success in reading all users")
  } catch(err) {
    console.log("Problem in reading users", err)
    logger.error("Problem in reading all users", err)
    response.status(400).json({
      status: false,
      data: err
    })
  }
}

exports.findOne = async(request, response) => {
  console.log("Find user with specific username")
  let username = request.params.username

  try {
    // const result = await User.findOne({
    //   username: username
    // })

    const result = await userService.findOne(username)
    if (result) {
      response.status(200).json({
        status: true,
        data: result
      })
    } else {
      response.status(404).json({
        status: false,
        data: "User not exists"
      })
    }

    
  } catch(err) {
    console.log("Problem in finding user", err)
    response.status(400).json({
      status: false,
      data: err
    })
  }
}

exports.create = async(request, response) => {
  console.log("Create user")
  
  let data = request.body
  const SaltOrRounds = 10  // πόσους κύκλους κρυπτογράφισης θα κάνει
  const hashedPassword = await bcrypt.hash(data.password, SaltOrRounds)

  const newUser = new User({
    username: data.username,
    password: hashedPassword,
    name: data.name,
    surname: data.surname,
    email: data.email,
    address: {
      area: data.address.area,
      road: data.address.road
    }
  })

  try{
    const result = await newUser.save();
    response.status(200).json({
      status: true,
      data: result
    })
  } catch(err) {
    console.log("Problem in creating user", err)
    response.status(400).json({
      status: false,
      data: err
    })
  }
}

exports.update = async(request,response) => {
  const username = request.body.username
  console.log("Update user with username", username)
  const data = request.body

  const updateUser = {
    name: data.name,
    surname: data.surname,
    email: data.email,
    address: {
      area: data.address.area,
      road: data.address.road
    }
  }

  try {
    const result = await User.findOneAndUpdate({username: username}, updateUser, {new: true})
    response.status(200).json({
      status: true,
      data: result
    })
  } catch(err) {
    console.log("There was an error with the update", err)
    response.status(400).json({
      status: false,
      data: err
    })
  }
}


exports.deleteByUsername = async(request, response) => {
  const username = request.params.username
  console.log("Delete user with username", username)

  try {
    const result = await User.findOneAndDelete({username:username})
    response.status(200).json({
      status: true,
      data: result
    })
  } catch (err) {
    console.log("There was an error with the delete", err)
    response.status(404).json({
      status: false,
      data: err
    })
  }
}


exports.deleteByEmail = async(request, response) => {
  const username = request.params.username
  const email = request.params.email
  console.log("Delete user with email", email)

  try {
    const result = await User.findOneAndDelete({email:email})
    response.status(200).json({
      status: true,
      data: result
    })
  } catch (err) {
    console.log("There was an error with the delete by email", err)
    response.status(404).json({
      status: false,
      data: err
    })
  }
}