const { Category, Package } = require("../models");
module.exports.createCategory = async function(req, res) {
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

//    Amreya Anfoushi AsafraAzaritaBahary Bakos Bolkly Camp Shezar Cleopatra El Atareen El GomrokEl Ibrahimiya El Labban El MaamoraEl Mandara El Mansheya El Max El Qabary El Saraya El Soyof Dekhela Downtown Fleming Gianaclis Glim Hadara Kafr Abdu Karmoz Kom El Deka Louran Mahatet El Raml Miami Moharam Bek Roshdy Saba Pasha Safar San Stefano Smouha Shatby Shods Sidi Bishr Sidi Gaber Sporting Stanley Tharwat Victoria Wardeyan Zezenia
}

module.exports.getCategories = async function(req, res) {
    try {
        const categories = await Category.findAll({
            include: [{ association:  "Packages", attributes: ['id', 'name', 'hours', 'price'], where: { available: true}}],
            order: [['id'],["Packages", 'price', 'ASC']],
            where: {
                available: true
            }
        })
        res.status(200).json({
            message: "success",
            categories: categories.map(category => ({
                id: category.id,
                name: category.name,
                event_type: category.eventType,
                packages: category.Packages && category.Packages.map(pack => ({ 
                    id: pack.categories_packages.id,
                    hours: pack.hours,
                    price: pack.price 
                }))
            }))
        })
    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: "error"
        })
    }
}
module.exports.getCategoriesPhotographer = async function(req, res) {
    try {
        const categories = await Category.findAll({
            attributes: ["id", "name"],
        })
        res.status(200).json({
            message: "success",
            categories: categories.map(category => ({
                id: category.id,
                name: category.name,
                
            }))
        })
    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: "error"
        })
    }
}