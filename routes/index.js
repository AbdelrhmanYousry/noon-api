const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const shootrCtrl = require("../controllers/photographer.controller");
const adminCtrl = require("../controllers/admin.controller");
const categoryCtrl = require("../controllers/category.controller");
const locationCtrl = require("../controllers/location.controller");
const passport = require("passport");


router.post("/signup", userCtrl.signUp);
router.post("/login", userCtrl.logIn);
router.post(
  "/make-event",
  passport.authenticate("jwt-user", { session: false }),
  userCtrl.makeEvent
);
router.get(
  "/events",
  passport.authenticate("jwt-user", { session: false }),
  userCtrl.getEvents
);
router.get(
  "/event/:eventId",
  passport.authenticate("jwt-user", { session: false }),
  userCtrl.getEvent
);
router.post("/photographer/signup", shootrCtrl.signUp);
router.post("/photographer/login", shootrCtrl.logIn);
router.post(
  "/photographer/update-categories",
  passport.authenticate("jwt-photographer", { session: false }),
  shootrCtrl.updateCategories
);
router.post(
  "/photographer/accept-event",
  passport.authenticate("jwt-photographer", { session: false }),
  shootrCtrl.acceptEvent
);
router.post(
  "/photographer/reject-event",
  passport.authenticate("jwt-photographer", { session: false }),
  shootrCtrl.rejectEvent
);
router.get(
  "/photographer/potential-events",
  passport.authenticate("jwt-photographer", { session: false }),
  shootrCtrl.potentialEvents
);
router.get(
  "/photographer/done-events",
  passport.authenticate("jwt-photographer", { session: false }),
  shootrCtrl.doneEvents
);

// admin apis
// router.post("/create-category", categoryCtrl.createCategory);
// router.post("/create-package", packageCtrl.createPackage);
// router.post("/create-location", locationCtrl.createLocation);
router.post("/dashboard/signup", adminCtrl.signUp);
router.post("/dashboard/login", adminCtrl.logIn);
router.get("/dashboard/events",passport.authenticate("jwt-admin", { session: false }), adminCtrl.getEvents)
router.get("/categories", categoryCtrl.getCategories);
router.get("/categories-photographer", categoryCtrl.getCategoriesPhotographer);
// router.get("/packages", packageCtrl.getPackages);
router.get("/locations", locationCtrl.getLocations);
router.get("/available-locations", locationCtrl.getAvailableLocations);
module.exports = router;
