const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

const flash = require("express-flash");
require("dotenv").config();

const app = express();

mongoose.connect(
  "mongodb+srv://admin-daniel:Test123@cluster0.if4il.mongodb.net/writeplug?retryWrites=true&w=majority&ssl=true",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
// mongoose.connect('mongodb://localhost:27017/writeplug', { useNewUrlParser: true, useUnifiedTopology: true });

//controllers
const { register, login } = require("./controllers/userController");
const {
  addProject,
  uploadGetRequest,
} = require("./controllers/uploadController");
const { getController } = require("./controllers/projectController");
const { homeGetController } = require("./controllers/homeController");
const { previewGetController } = require("./controllers/previewController");
const { verifyAccount } = require("./controllers/paymentDetails");
const { verify } = require("./controllers/verifyTransaction");
const { downloadGet } = require("./controllers/downloadController");
const { categoryGetController } = require("./controllers/categoryController");
const {
  adminProjectGetController,
  adminDeleteProject,
} = require("./controllers/adminProjectController");
const { adminGetUser } = require("./controllers/adminUserController");
const { getWriter, postWriter } = require("./controllers/hireWriterController");

//helpers
const upload = require("./helpers/storage");

//middleware
const authenticate = require("./middlewares/authenticator");
const adminAuthenticate = require("./middlewares/admin-authenticator");

const { Category } = require("./schemas/categorySchema");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(
  session({
    secret: "aklnodingaoinurjnanunva91n29",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoose.set("useCreateIndex", true);

app.get("/", homeGetController);

app.get("/all_category", async (req, res) => {
  let categories = await Category.find({});
  res.render("category", { categories: categories });
});

app.get("/projects", getController);

app
  .route("/upload")
  .get(authenticate, uploadGetRequest)
  .post(upload.single("uploadedDocument"), addProject);

app.get("/preview", previewGetController);

app.get("/payment-details", authenticate, verifyAccount);

app.get("/verify_transaction", verify);

app.get("/download/:token", downloadGet);

app.get("/admin-categories/:user", adminAuthenticate, categoryGetController);

app.get("/admin-projects/delete", adminDeleteProject);

app.get("/admin-projects/:user", adminAuthenticate, adminProjectGetController);

app.get("/admin-users/:user", adminAuthenticate, adminGetUser);

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(login);

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(register);

app.route("/hire").get(authenticate,getWriter).post(postWriter);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

const port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log(`Server started on ${port}`);
});
