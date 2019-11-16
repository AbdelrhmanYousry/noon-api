const bcrypt = require("bcrypt");
const { Photographer, Event } = require("../models");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
console.log(SECRET);
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
    Photographer.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(photographer => {
        if (photographer) {
          return res.status(400).json({
            msg: "photographer already exists"
          });
        }
        Photographer.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        }).then(photographer => {
          const token = jwt.sign(
            {
              id: photographer.id,
              name: photographer.name,
              email: photographer.email
            },
            SECRET
          );
          res.status(200).json({
            msg: "Photographer signed up successfully",
            access_token: "Bearer " + token,
            photographerName: photographer.name
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
  Photographer.findOne({
    where: {
      email: req.body.email
    }
  }).then(photographer => {
    if (!photographer) {
      return res.status(400).json({
        msg: "No photographer with this email"
      });
    }
    bcrypt.compare(req.body.password, photographer.password, (err, result) => {
      if (err) {
        return res.status(400).json({
          msg: "Error"
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            id: photographer.id,
            name: photographer.name,
            email: photographer.email
          },
          SECRET
        );
        return res.status(200).json({
          msg: "logged in successfully",
          access_token: "Bearer " + token
        });
      } else {
        return res.status(400).json({
          msg: "password is incorrect"
        });
      }
    });
  });
};


module.exports.assignEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.bod.eventId
      }
    })
    if (!event) {
      return res.status(400).json({
        message: "no event with this id"
      })
    }
    if(event.assigned) {
      return res.status(400).json({
        message: "no event already assigned"
      }) 
    }
    const assignEvent = await event.setPhotographer(req.photographer)

    res.status(200).json({
      message: "success"
    })
  } catch(err) {
    console.log(err)

    res.status(400).json({
      message: "error"
    })
  }
  
}