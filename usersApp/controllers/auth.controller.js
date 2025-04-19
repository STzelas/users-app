const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const authService = require('../services/auth.service')
const logger = require('../logger/logger')

exports.login = async(request, response) => {
  console.log("Login user", request.body)

  const data = request.body
  const username = data.username
  const password = data.password

  try {
    const result = await User.findOne({username:username})
    // bcrypt decrypt
    const isMatch = await bcrypt.compare(password, result.password)

    if(result && result.username === username && isMatch) {
      const token = authService.generateAccessToken(result)
      response.status(200).json({
        status: true,
        data: token
      })
    } else {
      response.status(404).json({
        status: false,
        data: "user not found"
      })
    }
  } catch(err) {
    console.log("Problem logging in", err)
    response.status(400).json({
      status:false,
      data: err
    })
  }
}

exports.googleLogin = async(request, response) => {
  const code = request.query.code

  try {
    if(!code) {
      response.status(400).json({
        status: false,
        data: "Authrorization code is missing"
      })
      logger.error("Authentication error in google login code request")
    } else {
      let user = await authService.googleAuth(code)
  
      if(user) {
        console.log(">>>", user)
  
        response.status(200).json({
          status: true,
          data: user
        })
        logger.info("Successful")
      } else {
        response.status(400).json({
          status: false,
          data: "Problem in google login"
        })
      }
    }
  } catch (err) {
    console.error("Problem with the request", err)
    response.status(400).json({
      status: false,
      data: err
    })
  }
}