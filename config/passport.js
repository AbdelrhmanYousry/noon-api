const { ExtractJwt } = require("passport-jwt");
const JwtStrategy = require("passport-jwt").Strategy;
const opts = {}
const { User, Photographer, Admin } = require("../models")
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
module.exports = passport => {
  passport.use('jwt-user', new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({
      where: {
        id: jwt_payload.id
      }
    }).then(user => {
      if (user) {
        return done(null, user)
      } else { 
        return done(null, false)

      }
    }).catch(err =>{
      console.log(err)
    })
  }))
  passport.use('jwt-photographer', new JwtStrategy(opts, (jwt_payload, done) => {
    Photographer.findOne({
      where: {
        id: jwt_payload.id
      }
    }).then(photographer => {
      if (photographer) {
        return done(null, photographer)
      }
      return done(null, false)
    }).catch(err =>{
      console.log(err)
    })
  }))
  passport.use('jwt-admin', new JwtStrategy(opts, (jwt_payload, done) => {
    Admin.findOne({
      where: {
        id: jwt_payload.id
      }
    }).then(admin => {
      if (admin) {
        return done(null, admin)
      }
      return done(null, false)
    }).catch(err =>{
      console.log(err)
    })
  }))
}