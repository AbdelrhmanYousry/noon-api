const { Package } = require("../models");

module.exports.getPackages = async (req, res) => {
    if (!req.body.categoryId) {
        return res.status(400).json({
            message: "please add categoryId"
          })
    }
    
    try {
        const packages = await Package.findAll({
            attributes: ["id", "name"]
        })
        res.status(200).json({
            message: "success",
            packages
        })
    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: "error"
        })
    }
} 