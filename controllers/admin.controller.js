const bcrypt = require("bcrypt");
const {
  Admin,
  Event,
} = require("../models");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

module.exports.signUp = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      msg: "please add your name"
    });
  }
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(400).json({
        msg: "Error"
      });
    }
    Admin.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(admin => {
        if (admin) {
          return res.status(400).json({
            msg: "Admin already exists"
          });
        }
        Admin.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        }).then(admin => {
          const token = jwt.sign(
            {
              id: admin.id,
              name: admin.name,
              email: admin.email
            },
            SECRET
          );
          res.status(200).json({
            msg: "Admin signed up successfully",
            access_token: "Bearer " + token,
            name: admin.name
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          msg: "Error"
        });
      });
  });
};

module.exports.logIn = (req, res) => {
  Admin.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(admin => {
      if (!admin) {
        return res.status(400).json({
          msg: "No admin with this email"
        });
      }
      bcrypt.compare(req.body.password, admin.password, (err, result) => {
        if (err) {
          return res.status(400).json({
            msg: "Error"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              id: admin.id,
              name: admin.name,
              email: admin.email
            },
            SECRET
          );
          return res.status(200).json({
            msg: "logged in successfully",
            access_token: "Bearer " + token,
            name: admin.name
          });
        } else {
          return res.status(400).json({
            msg: "password is incorrect"
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({
        msg: "Error"
      });
    });
};


module.exports.getEvents = (req, res) => {
  Event.findAll({
    include: [{ association: "Location" }, { association: "Owner" }],
    attributes: ['id', 'date', 'address', 'status'],
    order: [['date', 'DESC']]
  })
    .then(events => {
      if (events.length < 1) {
        return res.status(200).json({
          events: [],
          message: "you don't have Events yet"
        });
      }
      res.status(200).json({
        events: events.map(event => ({
          id: event.id,
          address: event.address,
          status: event.status,
          date: event.date,
          location: event.Location,
          user: event.Owner
        })),
        message: "success"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({
        message: "error",
        error: JSON.stringify(err, null, 2)
      });
    });
};