import passport from "passport";

import passportLocal from "passport-local";
import GitHubStrategy from "passport-github2";
import Managers from "../dao/managers/index.js";
const userModel = Managers.UsersManager;

import dotenv from "dotenv";

dotenv.config();

const LocalStrategy = passportLocal.Strategy;

const initializePassport = () => {
  // passport local - register
  passport.use(
    "create", // register
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;

          const user = await userModel.getUserByEmail({
            email: username,
          });

          if (user) {
            console.log("Usuario ya existe");
            return done(null, false);
          }

          const newUser_ = {
            first_name,
            last_name,
            email,
            age,
            password,
          };

          const newUser = await userModel.userCreate(newUser_);

          if (!newUser) {
            return done(null, false);
          }

          return done(null, newUser);
        } catch (e) {
          return done("Error to register" + e);
        }
      }
    )
  );

  // passport local - login
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const result = await userModel.userLogin(username, password);
          return done(null, result);
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  //passport Github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.5c71880f9e9e6f94",
        clientSecret: "78db4227ce746b0c61c8321141d859f6d657a4dd",
        callbackURL: "http://localhost:8080/auth/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const findUser = await userModel.getUserByEmail({
            email: profile._json.email,
          });

          if (findUser) {
            return done(null, findUser);
          }

          const newUser = {
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            password: "",
          };

          const result = await userModel.userCreate(newUser);

          return done(null, result);
        } catch (error) {
          return done("Error to register", error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.getUserById(id);
    done(null, user);
  });
};

export default initializePassport;
