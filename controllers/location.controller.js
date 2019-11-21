const { Location } = require("../models");
module.exports.createLocation = async function(req, res) {
    try {
        const creatingLocation = await Location.create({
            name: req.body.name,
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

module.exports.getLocations = async function(req, res) {
    try {
        const locations = await Location.findAll({
            attributes: ["id", "name"]
        })
        res.status(200).json({
            message: "success",
            locations
        })
    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: "error"
        })
    }
}