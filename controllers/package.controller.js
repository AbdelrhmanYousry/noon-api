const { Package } = require("../models");
module.exports.createPackage = (req, res) => {
    Package.create({
        name: req.body.name,
        hours:req.body.hours,
        price: req.body.price,
        category_id: req.body.categoryId
    }).then(package => {
        res.status(200).json({
            message: "success",
            package: package.id
        })
    }).catch(err => {
        res.status(400).json({
            message: String(err)
        })
    })
}
module.exports.getPackages = async (req, res) => {
    if (!req.body.categoryId) {
        return res.status(400).json({
            message: "please add categoryId"
          })
    }
    
    try {
        const packages = await Package.findAll({
            attributes: ["id", "name"],
            where: {
                category_id: req.body.categoryId
            }
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