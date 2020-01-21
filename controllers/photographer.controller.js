const bcrypt = require("bcrypt");
const {
  Photographer,
  Event,
  Category,
  Location,
  Sequelize: { Op },
  EventsPotentialPhotographers,
  sequelize
} = require("../models");
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");

const { SECRET, Bucket, AWSAccessKeyId, AWSSecretKey } = process.env;

require("dotenv").config(); // Configure dotenv to load in the .env file
// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: "eu-west-1", //
  accessKeyId: AWSAccessKeyId,
  secretAccessKey: AWSSecretKey
});

const S3_BUCKET = Bucket;
module.exports.signUp = async (req, res) => {
  const { name, selectedCategories, password, email, locationId, gears, portfolio, gender, years } = req.body;
  if (!name) {
    return res.status(400).json({
      msg: "please add your name"
    });
  }
  if (!email) {
    return res.status(400).json({
      msg: "please add your emaol"
    });
  }

  if (!locationId) {
    return res.status(400).json({
      msg: "please add your location"
    });
  }
  if (!years) {
    return res.status(400).json({
      msg: "please add your years"
    });
  }
  
  if (!gender) {
    return res.status(400).json({
      msg: "please add your gender"
    });
  }
  if (!selectedCategories || selectedCategories.length < 1) {
    return res.status(400).json({
      msg: "please add at least one category"
    });
  }

  try {
    const photographer = await Photographer.findOne({
      where: {
        email
      }
    });
    if (photographer) {
      return res.status(400).json({
        msg: "photographer already exists"
      });
    }
    const subscribedCategories = await Category.findAll({
      where: {
        id: {
          [Op.in]: selectedCategories
        }
      },
      attributes: ["id"]
    });
    const hash = await bcrypt.hash(password, 10);
    const createdPhotographer = await Photographer.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      location_id: locationId,
      gender,
      years_experience: years,
      gear: gears,
      portfolio
    });
    const assigningCategoriesToPhotographer = await createdPhotographer.setCategories(
      subscribedCategories
    );
    const token = jwt.sign(
      {
        id: createdPhotographer.id,
        name: createdPhotographer.name,
        email: createdPhotographer.email
      },
      SECRET
    );
    res.status(200).json({
      msg: "Photographer signed up successfully",
      access_token: "Bearer " + token,
      photographerName: createdPhotographer.name
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Error"
    });
  }
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
    if (!photographer.active) {
      return res.status(400).json({
        msg: "Your account is not activated yet, will contact you shortly."
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
    });
    if (!event) {
      return res.status(400).json({
        message: "no event with this id"
      });
    }
    if (event.assigned) {
      return res.status(400).json({
        message: "no event already assigned"
      });
    }
    const assignEvent = await event.setPhotographer(req.photographer);

    res.status(200).json({
      message: "success"
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "error"
    });
  }
};

module.exports.uploadImage = (req, res) => {
  const s3 = new aws.S3(); // Create a new instance of S3
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;
  // Set up the payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: "public-read"
  };
  // Make a request to the S3 API to get a signed URL which we can use to upload our file
  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).json({ success: false, error: err });
    }
    // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.

    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    // Send it all back
    res.status(200).json({ success: true, data: { returnData } });
  });
};

module.exports.updateCategories = async (req, res) => {
  const {
    user,
    body: { selectedCategories }
  } = req;
  console.log(req.photographer);
  if (!selectedCategories || selectedCategories.length < 1) {
    return res.status(400).json({
      msg: "please add at least one category"
    });
  }
  try {
    const subscribedCategories = await Category.findAll({
      where: {
        id: {
          [Op.in]: selectedCategories
        }
      },
      attributes: ["id"]
    });
    console.log("heeeeere");
    console.log(user);

    const assigningCategoriesToPhotographer = await user.setCategories(
      subscribedCategories
    );
    res.status(200).json({
      msg: "success"
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Errors"
    });
  }
};
module.exports.acceptEvent = async (req, res) => {
  try {
    const {
      user: photographer,
      body: { eventId }
    } = req;
    if (!eventId) {
      return res.status(400).json({
        msg: "add evenId"
      });
    }
    const event = await photographer.getUpcomingEvent({
      where: {
        id: eventId,
        assigned: false
      },
      attributes: ["id", "status", "date", "address"]
    });
    const eventRelation = await EventsPotentialPhotographers.findOne({
      event_id: eventId,
      photographer_id: photographer.id
    })
    if (!event) {
      return res.status(400).json({
        msg: "you don't have this event any more"
      });
    }
    let result = await sequelize.transaction( async transaction => {
      await photographer.addEvent(event, {transaction})
      await event.update({ assigned: true}, {transaction})
      await photographer.update( {acceptace_count: photographer['acceptace_count'] +1}, {transaction})
      await eventRelation.update({ accepted: true}, {transaction})
    });

    // const acceptedEvent = await photographer.addEvent(event)
    // const updateEventStatus = await event.update({ assigned: true})
    // const updateAcceptance = await photographer.increment( 'acceptace_count', {by: 1})
    // const updateAcceptance = await photographer.update( {acceptace_count: photographer['acceptace_count'] +1}, {transaction})

    res.status(200).json({
      msg: "success"
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Error"
    });
  }
};

module.exports.rejectEvent = async (req, res) => {
  try {
    const {
      user: photographer,
      body: { eventId }
    } = req;
    if (!eventId) {
      return res.status(400).json({
        msg: "add evenId"
      });
    }
    const event = await photographer.getUpcomingEvent({
      where: {
        id: eventId,
        assigned: false
      },
      attributes: ["id", "status", "date", "address"]
    });
    const eventRelation = await EventsPotentialPhotographers.findOne({
      event_id: eventId,
      photographer_id: photographer.id
    })
    if (!event) {
      return res.status(400).json({
        msg: "you don't have this event any more"
      });
    }
    let result = await sequelize.transaction( async transaction => {
      await photographer.update( {decline_count: photographer['decline_count'] +1}, {transaction})
      await eventRelation.update({ rejected: true}, {transaction})
    });

    // const acceptedEvent = await photographer.addEvent(event)
    // const updateEventStatus = await event.update({ assigned: true})
    // const updateAcceptance = await photographer.increment( 'acceptace_count', {by: 1})
    // const updateAcceptance = await photographer.update( {acceptace_count: photographer['acceptace_count'] +1}, {transaction})

    res.status(200).json({
      msg: "success"
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Errors"
    });
  }
};

module.exports.potentialEvents = async (req, res) => {
  try {
    const { user: photographer } = req;
    const events = await photographer.getUpcomingEvents({
      where: {
        assigned: false
      },
      attributes: ["id", "status", "date", "address"]
    });
    res.status(200).json({
      msg: "success",
      events
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Errors"
    });
  }
};

module.exports.doneEvents = async (req, res) => {
  try {
    const { user: photographer } = req;
    const events = await photographer.getEvents({
      attributes: ["id", "status", "date", "address"]
    });
    res.status(200).json({
      msg: "success",
      events
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Errors"
    });
  }
};
