const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Set up middleware to serve static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req, res){
  const {name, email, subject, message} = req.body;
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "Yay!  Got a New Admission Form",
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).sendFile(__dirname + "/error.html");
    } else {
      console.log('Email sent: ' + info.response);
      res.sendFile(__dirname + "/success.html");
    }
  });
})

app.listen(process.env.PORT || 2605, function(){
  console.log("Server running at port 2605");
})
