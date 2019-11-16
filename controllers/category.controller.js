const { Category } = require("../models");
module.exports.createCategory = async function(req, res) {
    try {
        const creatingCategory = await Category.create({
            name: req.body.name,
            pph: req.body.pph
        })

        res.status(200).json({
            message: "success"
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: "error"
        })
    }
    
    
}

module.exports.getCategories = async function(req, res) {
    try {
        const categories = await Category.findAll({
            attributes: ["id", "name"]
        })
        res.status(200).json({
            message: "success",
            categories
        })
    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: "error"
        })
    }
}