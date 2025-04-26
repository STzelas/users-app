// Παίρνει το model με το mongoose, το μετατρέπει
// σε json και με επιτρέπει να το εμφανίσω 
// στην σελίδα του swagger την οποία έχω
const m2s = require('mongoose-to-swagger')
const User = require('./models/user.model')

exports.options = {
  "components": {
    "schemas": {
      User: m2s(User)  // Το μετατρέπει σε json
    },
    "securitySchemes": {  // Για να βάλω στο swagger το jwt token
      "bearerAuth": {
        "type":"http",
        "scheme":"bearer",
        "bearerFormat":"JWT"
      }
    }
  },
  "security":[            // Για να βάλω στο swagger το jwt token
    {"bearerAuth":[]}    
  ],
  "openapi":"3.1.0",
  "info": {
    "version": "1.0.0",
    "title":"Users and Products CRUD API",
    "description":"An application for creating users and choosing products",
    "contact": {
      "name":"API Support",
      "URL":"https://aueb.gr",
      "email":"support@example.com"
    }
  },
  "servers": [ // Δηλώνουμε που θέλουμε να τρέξει τις κλήσεις
    {
      url: "http://localhost:3000",
      description: "Local server"
    },
    {
      url:"http://www.backend.aueb.gr",
      description:"Test server"
    }
  ],
  "tags": [ // Ομαδοποιούμε τις κλήσεις στο tags στο swagger
    {
      "name":"Users",
      "description":"Endpoints for User"
    },
    {
      "name":"Users and Products",
      "description":"Endpoints for users and their products"
    },
    {
      "name":"auth",
      "description":"Endpoints for Authentication"
    }
  ],  // Δηλώνω τα endpoints μου
  "paths": {   // φέρνει όλους τους users
    "/api/users": {
      "get": {
        "tags":["Users"],
        "description":"Returns a list of all users",
       "responses": {  // status
        "200": {
          "description":"List of all users",
          "content": {
            "application/json": {
              "schema": {
                "type":"array",
                "items": {
                  "$ref": "#/components/schemas/User"
                }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags":["Users"],
        "description":"Data of users that we want to create",
        "requestBody":{
          "description":"JSON with user data", // optional, best practice is to have desc
          "content":{
            "application/json":{
              "schema":{  // Περιγραφή των data
                "type":"object",
                "properties": {   // Περιγραφή των πεδίων σε object
                  "username": {"type":"string"},
                  "password": {"type":"string"},
                  "name": {"type":"string"},
                  "surname": {"type":"string"},
                  "email": {"type":"string"},
                  "address": {
                    "type":"object",
                    "properties":{
                      "area": {"type":"string"},
                      "road": {"type":"string"}
                    }
                  },
                  "phone": {
                    "type":"array",
                    "items":{  // Περιγραφή των πεδίων σε array
                      "type": "object",
                      "properties": {
                        "type": {"type":"string"},
                        "number": {"type":"number"},
                      }
                    }
                  }
                },
                "required":["username","password","name","surname","email"]
              }
            }
          }
        },
        "responses":{
          "200":{
            "description":"JSON of new user"
          }
        }
      }
    },
    "/api/users/{username}": { // Φέρνει έναν user με συγκεκριμένο username
      "get": {
        "tags":["Users"],
        "parameters":[
          {
            "name":"username",
            "in":"path", // βρίσκεται σε path (path parameter)
            "required":true,
            "description":"Username of user that we want to find",
            "type":"string"
          }
        ],
        "description":"Returns users details for specific username",
        "responses": {
          "200": {
            "description":"User details"
          }
        }
      },
      "patch": {
        "tags": ["Users"],
        "description": "Update user",
        "parameters": [
          {
            "name":"username",
            "in":"path",
            "required": true,
            "description":"username of user that can update",
            "type":"string"
          }
        ],
        "requestBody":{
          "description":"Data of user to update",
          "content": {
            "application/json":{
              "schema": {
                "type":"object",
                "properties":{
                  "username": {"type":"string"},
                  "name": {"type":"string"},
                  "surname": {"type":"string"},
                  "email": {"type":"string"},
                  "address": {
                    "type":"object",
                    "properties":{
                      "area": {"type":"string"},
                      "road": {"type":"string"}
                    }
                  }
                },
                "required":["email"]
              }
            }
          }
        },
        "responses":{
          "200":{
            "description":"Update User"
          }
        }
      },
      "delete":{  // Διαγράφει έναν user με συγκεκριμένο username
        "tags":["Users"],
        "description":"Delete user from DB",
        "parameters": [
          {
            "name":"username",
            "in":"path",
            "description":"User to delete",
            "type":"string",
            "required":true
          }
        ],
        "responses":{
          "200":{
            "description":"Delete a user"
          }
        }
      }
    },
    "/api/auth/login": { // Ενα call για να δωσει ενα jwt token
      "post": {
        "tags":["Auth"],
        "description":"Login User",
        "requestBody": {
          "description":"User send username and password and for response we have jwt token",
          "content": {
            "application/json": {
              "schema": {
                  "type":"object",
                  "properties": {
                    "username": { "type":"string"},
                    "password": { "type":"string"}
                 },
                 "required": ["username", "password"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description":"Token returned"
          }
        }
      }
    },
    "/api/user-product/{username}": {
        "get": {
          "tags": ["Users and Products"],
          "parameters": [
            {
              "name":"username",
              "in":"path",
              "required": true,
              "description": "Find user and products",
              "type":"string"
            }
          ],
          "responses":{
            "200": {
              "description":"User and products",
              "schema":{
                "$ref":"#/components/schemas/User"
              }
            }
          }
        }
    }
  }
}