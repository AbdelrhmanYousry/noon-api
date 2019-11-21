const { Package } = require("../models");
module.exports.createPackage = (req, res) => {
    Package.bulkCreate(req.body.packages.map(pack => ({
        name: pack.name,
        hours: pack.hours,
        price: pack.price,
        CategoryId: pack.categoryId
    }))).then(packages => {
        res.status(200).json({
            message: "success",
        })
    }).catch(err => {
        res.status(400).json({
            message: String(err)
        })
    })
}
module.exports.getPackages = async (req, res) => {

    if (!req.query.categoryId) {
        return res.status(400).json({
            message: "please add categoryId"
          })
    }
    
    try {
        const packages = await Package.findAll({
            where: {
                CategoryId: req.query.categoryId
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
