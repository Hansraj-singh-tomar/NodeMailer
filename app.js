const nodemailer = require('nodemailer');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require("fs");

const express = require('express');
const { nextTick } = require('process');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));

var to;
var subject;
var body;
var path;

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./images') 
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
})

var upload = multer({
    storage:storage
}).single('image');

app.get('/', (req,res) => {
    res.sendFile('/index.html');
})

app.post('/sendemail', (req,res) => {
    // execute this middleware to upload the image
    upload(req,res,function(err){
        if(err){
            console.log(err);
            return res.end("something went wrong");
            // return next(err);
        }else{
           to = req.body.to;
           subject = req.body.subject;
           body = req.body.body;
           path = req.file.path;
           console.log(to);
           console.log(subject);
           console.log(body);
           console.log(req.file);
           console.log(path);


           // configuration of nodemailer 
           var transporter = nodemailer.createTransport({
               service : 'gmail',
               auth : {
                   user: 'hansrajput033@gmail.com',
                   pass: '...........'
               }
           });
           var mailOptions = {
               from : "hansrajput033@gmail.com",
               to: to,
               subject: subject,
               text: body,
               attachments: [
                   {
                       path : path
                   }
               ]
           };
           transporter.sendMail(mailOptions, function(error, info){
               if(error) {
                   console.log(error);
               } else {
                   console.log("Email sent :" + info.response);
                   fs.unlink(path,function(err){
                       if(err){
                           return res.end(err);
                       }else{
                           console.log("deleted");
                           return res.redirect('/result.html');
                       }
                   })
               }
           })


        }
    })
})


app.listen(8000, () => {
    console.log("App started on port 8000");
});
