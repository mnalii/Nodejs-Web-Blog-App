const express = require("express");
// const morgan = require("morgan");
const { config, engine } = require("express-edge");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");
const connectFlash = require("connect-flash");
const edge = require("edge.js");
const cloudinary = require("cloudinary");

const env = process.env.NODE_ENV || "development";

if (env == "development" || env == "test") {
  require("dotenv").config();
}

const configDb = {
  development: process.env.DB_LOCAL_URI,
  test: process.env.DBTEST,
  production: process.env.DB_PROD_URI
};

// DB Connection
mongoose
  .connect(configDb[env], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Database Connected"))
  .catch(err => console.log(err.message));

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_NAME
});

// Controllers
const createPostController = require("./controllers/createPost");
const homePageController = require("./controllers/homePage");
const storePostController = require("./controllers/storePost");
const getSinglePostController = require("./controllers/getSinglePost");
const registerController = require("./controllers/createUser");
const storeUserController = require("./controllers/userStore");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const logoutController = require("./controllers/logout");

const app = express();

const mongoStore = connectMongo(expressSession);

// Auth Middleware
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require("./middleware/redirectAuthenticated");

// Middlewares
app.use(fileUpload());
app.use(
  expressSession({
    secret: process.env.EXRESS_SESSION_KEY,
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: true
  })
);

app.use(connectFlash());

// app.use(connectMongo(expressSession));

// app.use(morgan("tiny"));

// Static file
app.use(express.static("public"));

// Template Engine
app.use(engine);
app.set("views", `${__dirname}/views`);

app.use("*", (req, res, next) => {
  edge.global("auth", req.session.userId);

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Validate File Upload Middleware
const storePost = require("./middleware/storePost");

app.get("/", homePageController);
app.get("/post/get/:id", getSinglePostController);
app.get("/post/new", auth, createPostController);
app.post("/post/store", auth, storePost, storePostController);
app.get("/auth/register", redirectIfAuthenticated, registerController);
app.get("/auth/logout", auth, logoutController);
app.post("/users/register", redirectIfAuthenticated, storeUserController);
app.get("/auth/login", redirectIfAuthenticated, loginController);
app.post("/users/login", redirectIfAuthenticated, loginUserController);
app.use((req, res) => res.render("not-found"));

app.listen(process.env.PORT, () =>
  console.log(
    `App listening on port ${process.env.PORT} and running on ${env} environment`
  )
);
