const passport = require("passport");
const User = require("../schemas/userSchema");

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const userController = {
  register: async (req, res) => {
    const username = req.body.username;
    const emailAddress = req.body.email;

    let user;
    const newUser = new User({
      username: username,
      emailAddress: emailAddress,
    });
    try {
      user = await User.register(newUser, req.body.password);
    } catch (error) {
      if (error.name == "MongoError") {
        req.flash("error", "Email Has been Used Already");
      } else {
      }
      console.log(error.message);
      res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/");
    });
  },
  login: async (req, res) => {
    const username = req.body.email;
    const password = req.body.password;

    const newUser = new User({
      username: username,
      password: password,
    });
    console.log(newUser);
    if (req.isUnauthenticated()) {
      req.login(newUser, (err) => {
        if (err) {
          console.log(err);
          res.redirect("/login");
        } else {
          passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
            failureFlash: true,
          })(req, res);
        }
      });
    }
  },
};

module.exports = userController;
