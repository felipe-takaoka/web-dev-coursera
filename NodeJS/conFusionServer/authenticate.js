require("dotenv").config();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("./models/user");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");
var FacebookTokenStrategy = require("passport-facebook-token");

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      }
      return done(null, false);
    });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });
exports.verifyAdmin = (req, _, next) => {
  console.log(req.user);
  if (req.user && req.user.admin) {
    next();
  } else {
    const err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    next(err);
  }
};

exports.facebookPassport = passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) {
          return done(err, false);
        } else if (!err && user !== null) {
          return done(null, user);
        }
        const newUser = new User({ username: profile.displayName });
        newUser.facebookId = profile.id;
        newUser.firstname = profile.name.givenName;
        newUser.lastname = profile.name.familyName;
        newUser.save((err, user) => {
          if (err) return done(err, false);
          else return done(null, user);
        });
      });
    }
  )
);
