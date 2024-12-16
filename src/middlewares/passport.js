const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const sequelize = require("../database");
const { User, Role } = require("../models/associations");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/account/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile._json.email;
        console.log(profile);
        let user = await User.findOne({ where: { email } });

        if (!user) {
          const transaction = await sequelize.transaction();
          const newUser = await User.create(
            {
              userName: profile._json.name,
              email,
              isVerified: true,
            },
            { transaction }
          );

          const roleUser = await Role.findOne(
            { where: { name: "user" } },
            { transaction }
          );

          if (roleUser) {
            await newUser.addRole(roleUser, { transaction });
          }

          await transaction.commit();
          user = newUser;
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
