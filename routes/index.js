const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const shootrCtrl = require("../controllers/photographer.controller");
const categoryCtrl = require("../controllers/category.controller");
const packageCtrl = require("../controllers/package.controller");
const passport = require("passport")
router.post("/signup", userCtrl.signUp)
router.post("/login", userCtrl.logIn)
router.post("/shootr/signup", shootrCtrl.signUp)
router.post("/shootr/login", shootrCtrl.logIn)

router.post("/make-order", passport.authenticate("jwt-user", { session: false}), userCtrl.makeEvent)
router.get("/events", passport.authenticate("jwt-user", { session: false}), userCtrl.getEvents)

// admin apis
router.post("/create-category", categoryCtrl.createCategory);
router.post("/create-package", packageCtrl.createPackage);
router.get("/categories", categoryCtrl.getCategories);
router.get("/packages", packageCtrl.getPackages);
module.exports = router;