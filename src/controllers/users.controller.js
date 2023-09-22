import Manager from "../dao/managers/index.js";

export const getRegister = (req, res) => {
  try {
    res.render("register", {});
  } catch (error) {
    console.log(error);

    res.status(404).send({
      message: "Page not found",
    });
  }
};

export const getLogin = (req, res) => {
  try {
    res.render("login", {});
  } catch (error) {
    console.log(error);

    res.status(404).send({
      message: "Page not found",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } =
      req.body;

    const findUser = await Manager.UsersManager.getUserByEmail(email);

    //si el mail ya existe, redirige al login
    if (findUser) {
      return res.status(302).redirect("/login");
    }

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password,
    };

    const user = await Manager.UsersManager.userCreate(newUser);

    if (!user) {
      return res.status(200).redirect("/register");
    }

    res.redirect("/login");
  } catch (error) {
    console.log(error);

    res.status(302).redirect("/register");
  }
};

export const userLogout = (req, res) => {
  try {
    req.session.destroy();

    res.redirect("/login");
  } catch (error) {
    console.log(error);

    res.status(302).send({
      message: "SOMETHING WENT WRONG",
    });
  }
};

// user login sin passport
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user = {
        first_name: "admin",
      };
      req.session.user.role = "admin";

      return res.redirect("/home/products");
    }

    const user = await Manager.UsersManager.userLogin(email, password);

    if (!user) {
      return res.status(401).render("login", {});
    }

    req.session.user = user;

    res.redirect("/home/products");
  } catch (error) {
    console.log(error);

    res.status(302).redirect("/login");
  }
};

//user login passport local
export const loginUserPassport = async (req, res) => {
  if (!req.user) res.status(400).send("Invalid credentials");

  req.session.user = req.user;

  return res.redirect("/home/products");
};

//user register passport local
export const createUserPassport = async (req, res) => {
  return res.redirect("/login");
};

// user login passport github
export const loginUserGithub = async (req, res) => {
  if (!req.user) res.status(400).send("Something went wrong");

  req.session.user = req.user;

  return res.redirect("/home/products");
};
