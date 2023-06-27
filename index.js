const express = require("express");
const app = express();
const port = 4000;
const db= require("./Model/index");
const studentController = require ("./Controller/studentController");
const {storage, multer} = require("./Services/multerConfig");
const upload = multer({storage:storage})
const path = require("path")
app.set("view engine","ejs");

require("./Config/db");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"Uploads")));


//---------------database----------------


db.sequelize.sync({force:false});

app.get("/", studentController.index);

app.post("/register", upload.single("file"),studentController.createStudent); //upload.... is middleware

app.get("/login", studentController.renderLogin);

app.post("/login", studentController.loginStudent);

app.post("/sendEmail", studentController.email);

app.get("/sendEmail", studentController.renderEmail);

app.get("/forgotPassword",studentController.forgotPassword);

app.post("/verifyEmail",studentController.verifyEmail)

app.post("/resetPassword",studentController.resetPassword)


//starting the server
app.listen(port, () => {
  console.log("Node server started at port 4000");
});