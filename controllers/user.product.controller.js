const User = require('../models/user.model')

exports.findAll = async(request, response) => {
  console.log("Find from all users the products")

  try {
    const result = await User.find({},{_id: 0, username: 1, products: 1})
    response.status(200).json({
      status: true,
      data: result
    })
  } catch(err) {
    console.log("Error finding from all products from all users", err)
    response.status(400).json({
      status: false,
      data: err
    })
  }
}


exports.findOne = async(request, response) => {
  console.log("Find products from a specific user")

  const data = request.params

  const username = data.username

  try {
    const result = await User.findOne({username:username}, {username: 1, products: 1, _id: 0})

    response.status(200).json({
      status:true,
      data: result
    })
  } catch (err) {
    console.log("Error in finding specific user", err)
    response.status(404).json({
      status:false,
      data: err
    })
  }
}


exports.create = async(request, response) => {
  console.log("Insert products to user")

  const data = request.body
  const username = data.username
  const products = data.products

  try {
    const result = await User.updateOne({username:username}, 
      {
        $push: {
          products: products
        }
      })
    response.status(200).json({
      status: true,
      data: result
    })
  } catch(err) {
    console.log("Error in inserting product", err)
    response.status(400).json({
      status: false,
      data: err
    })
  }

}


exports.update = async(request, response) => {
  console.log("Updating user...")

  const data = request.body
  const username = data.username
  const product_id = data._id

  console.log("Update product for username: ", username)


  try {
    const result = await User.updateOne({username: username, "product._id": product_id}, 
      {
        $set: {
          "product.$.quantity": product_quantity
        }},
    )
    response.status(200).json({
      status: true,
      data: result
    })


  } catch(err) {
    console.log("Problem in updating product", err)
    response.status(400).json({
      status: false,
      data: err
    })
  }
}

exports.delete = async(request, response) => {
  const username = request.params.username
  const product_id = request.params._id

  console.log("deleting user", username)

  try {
    const result = await User.updateOne({username:username}, 
      {
        $pull: {
          products: {_id: product_id}
        }
      })

      response.status(200).json({
        status:true,
        data: result
      })
  } catch (error) {
    console.log("Error in deleting user", err)
    response.status(400).json({
      status: false,
      data: err
    })
  }
}

exports.stats1 = async(request, response) => {
  console.log("For each users return total amount and num of products")

  try {
    const result = await User.aggregate([
      {
        $unwind: "$products"
      },
      {
        $project: {
          _id: 1,
          username: 1,
          products: 1
        }
      },
      {
        $group: {
          _id: {username: "username", product: "$products.product"},
          totalAmount: {
            $sum: {$multiply: ["$products.cost","$products.quantity"]}
          },
        count: {$sum: 1}
        }
      },
      { $sort: {"_id.username": 1, "_id.product": 1} }
    ])

    response.status(200).json({
      status: true,
      data: result
    })
  } catch (err) {
    console.log("Error in stats1", err)
    response.status(400).json({
      status:false,
      data: err
    })
  }
}