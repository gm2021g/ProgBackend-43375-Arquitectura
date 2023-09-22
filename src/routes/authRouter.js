import express from "express";
import Manager from "../dao/managers/index.js";
import passport from "passport";
import {
  createUserPassport,
  getLogin,
  getRegister,
  loginUserGithub,
  loginUserPassport,
  userLogout,
} from "../controllers/users.controller.js";

const Router = express.Router();

// Vista del login
Router.get("/login", getLogin);

// Enviando solicitud de log
Router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  loginUserPassport
);

// Enviano solicitud de logout
Router.get("/logout", userLogout);

// Vista de registro
Router.get("/register", getRegister);

// Enviando solicitud de registro
Router.post(
  "/create",
  passport.authenticate("create", { failureRedirect: "/register" }),
  createUserPassport
);

//login con github
Router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

Router.get(
  "/auth/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  loginUserGithub
);

//Vista administrador de usuarios
Router.get("/admin", async (req, res) => {
  try {
    const role = req.session.user.role;

    const users = await Manager.UsersManager.getAllUser();

    if (role === "admin") {
      return res.render("admin", {
        style: "styles.css",
        users,
      });
    }

    return res.redirect("/home/products");
  } catch (error) {}
});

export default Router;
