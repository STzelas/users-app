const jwt = require('jsonwebtoken')
const authService = require('../services/auth.service')


function verifyToken(request, response, next) {
  const authHeader = request.headers['authorization']   // μπούσουλας του jwt
  const token = authHeader && authHeader.split(' ')[1]

  if(!token) {
    return response.status(401).json({
      status: false,
      message: "Access Denied. No token provided"
    })
  } 

  const result = authService.verifyAccessToken(token)

  if(result.verified) {
    request.user = result.data // καινούργια μεταβλητή user, θα περιέχει το decoded αν είναι verified
    next()
    
  } else {
    return response.status(403).json({
      status: false,
      data: result.data
    })
  }

  
}

function verifyRoles(allowedRole) {
  return (request, response, next) => {
    if((!request.user || !request.user.roles)) {
      return response.status(403).json({
        status: false,
        data: "Forbidden: No roles found"
      })
    } 
    
    const userRoles = request.user.roles  // array

    const hashPermission = userRoles.includes(allowedRole)

    if (!hashPermission) {
      return response.status(403).json({
        status: false,
        data: "Forbidden: insufficient permissions"
      })
    }

    next()
  }
}

module.exports = { verifyToken, verifyRoles }