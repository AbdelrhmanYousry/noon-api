const bcrypt = require("bcrypt");
const { User, Category, sequelize, Event, Sequelize } = require("../models");
const { Op } = Sequelize;
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
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        if (user) {
          return res.status(400).json({
            msg: "User already exists"
          });
        }
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        }).then(user => {
          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email
            },
            SECRET
          );
          res.status(200).json({
            msg: "User signed up successfully",
            access_token: "Bearer " + token,
            name: user.name
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
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (!user) {
      return res.status(400).json({
        msg: "No user with this email"
      });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(400).json({
          msg: "Error"
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email
          },
          SECRET
        );
        return res.status(200).json({
          msg: "logged in successfully",
          access_token: "Bearer " + token,
          name: user.name
        });
      } else {
        return res.status(400).json({
          msg: "password is incorrect"
        });
      }
    });
  }).catch(err => {
    console.log(err);
    res.status(400).json({
      msg: "Error"
    });
  });
};

module.exports.makeEvent = async (req, res) => {
  const {typeId, startDate, endDate, locationId, address, packageId } = req.body
  if (!typeId) {
    return res.status(400).json({
      message: "no type"
    })
  }
  if (!startDate) {
    return res.status(400).json({
      message: "no start"
    })
  }
  if (!endDate) {
    return res.status(400).json({
      message: "no end"
    })
  }
  if (!locationId) {
    return res.status(400).json({
      message: "no location"
    })
  }
  if (!address) {
    return res.status(400).json({
      message: "no address"
    })
  }
  if (!packageId) {
    return res.status(400).json({
      message: "no address"
    })
  }
   
  try {
    const category = await Category.findOne({
      where: {
        id: req.body.typeId
      }
    });
    const photographers = await category.getPhotographers({
      where: {
        location_id: locationId,
        order: [['work_done','DESC']],
        limit: 5
      }
    });
    
    
    
    if (photographers.length < 1) {
      return res.status(400).json({
        message: "no shootrzz available for this type yet and your time"
      })
    }
    const createdEvent = await Event.create({
      package_id: packageId,
      location_id: locationId,
      user_id: req.user.id,
      address
    });
    const assignPhotographers = await createdEvent.setPotentialPhotographers(photographers)
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

module.exports.getEvents = (req, res) => {
  // Order.findAll({
  //   where: {
  //     user_id:  req.user.id
  //   }
  // }).
  req.user.getEvents().  
  then(events => {
    if(events.length < 1) {
      return res.status(200).json({
        events: [],
        message: "you don't have Events yet"
      })
    }
    res.status(200).json({
      events,
      message: "success"
    })
  }).catch(err => {
    console.log(err)
    res.status(400).json({
      message: "error"
    })

  })
}