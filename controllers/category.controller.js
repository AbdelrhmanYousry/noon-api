const { Category } = require("../models");
module.exports.createCategory = async function(req, res) {
    console.log(req.body)
    try {
        const creatingCategory = await Category.create({
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
//     Abbassia
// Ain Shams
// Azbakeya
// Bulaq
// Daher
// Al-Darb al-Ahmar
//El Marg
//Helwan
// 15th of May
// Mokattam
// Manshiyat Naser
// Nasr City
// El Qobbah
// El Manial
// El Sakkakini
// Shubra
// El Sahel
// Rod El Farag
// Zeitoun 
	
// Garden City Heliopolis Maadi Zamalek
    	
// Badr Madinaty New Cairo El Rehab New Heliopolis El Shorouk
    	
// Agouza Mit Okba Imbaba

// DokkiMohandessin
// Shubra El Kheima
// Obour
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