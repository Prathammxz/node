const db = require("../Model/index");
const Student = db.student;
const bcrypt = require("bcryptjs");
const sendEmail = require("../Services/sendEmail");

exports.index = async (req, res) => {

    res.render("index");
};


exports.renderLogin = async(req,res) =>{
    
    res.render("login");
};

exports.createStudent = async (req, res) =>{
    console.log(req.file)
    const {name, email, address,password,file}= req.body
    // const name= req.body.name;
    // const email= req.body.email;
    // const address= req.body.address;
    // const contact= req.body.contact; <---same thing as writing all at once instead of individually---> const {name, email, address,contact}= req.body

 //create is for insreting into database 
    const created = await db.student.create({    
        name: name,        // <---if column name is same as object, you can simply pass the name or else like this with (databse column name : object name)
        email: email,
        address: address,
        password: bcrypt.hashSync(password,10),
        file: req.file.filename,  //encrypting password, here 10 stands for salt which is to make decryption harder(hash is  one way, cannot be unhashed)
        //file: "http://localhost:4000/" + req.file.filename,   -----> alternate for above
    });

    console.log(created);

    //to notify the user upon succefssful registration.
    if(created){
      try {
          const message = "You have successfully registered.";
      
          await sendEmail({
            to: req.body.email,
            text: message,
            subject: "Registration Successful",
          });
        } catch(e) {
          console.log("error sending mail");
          res.render("error");
        }
    }
   
    //redirecting to another page
    res.redirect("/login")

};



exports.loginStudent= async(req, res) =>{
    console.log(req.body)       //req.body is not required while getting data from databasse
    const{email,password} = req.body;
    console.log(email,password);


    const foundStudent = await db.student.findAll({
        where:{
            email: email,
        }
    });

    if(foundStudent.length==0){     //checking if email exists
        return res.redirect("/login");   
    }

    console.log(foundStudent[0].password);
    console.log(bcrypt.compareSync(password,foundStudent[0].password));

    if(bcrypt.compareSync(password,foundStudent[0].password)){ 
        res.redirect("/home");
    } else{
        res.redirect("/login");    
    }

};

exports.email= async(req,res)=>{
    try{
     const{subject, message} = req.body
     console.log(subject, message);

     // finding email from database
     const allUsers = await db.student.findAll({
        
     });
     allUsers.forEach(async(user)=>{
          await sendEmail({
              to:user.email,
              text:message,
              subject: subject,
      })
     


     })
      }catch{
         console.log("error sending mail")
         res.render("error")
      };
 };

exports.renderEmail = async(req,res) =>{    
    res.render("notification");
};

exports.forgotPassword=async(req,res)=>{
    res.render('forgotPassword')

};
exports.resetPassword=async(req,res)=>{
    res.render('resetPassword')

};