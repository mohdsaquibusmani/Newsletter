const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const https = require("https");
// const client = require("@mailchimp/mailchimp_marketing");

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.listen(process.env.PORT || 3000,function(){
    console.log("Server on port 3000 has started : ");
})

app.get("/",function(req,res){
    res.sendFile(__dirname +"/signup.html");
})

app.post("/",function(req,res){
    const fname = req.body.fName
    const lname = req.body.lName
    const email = req.body.email
    
    //making a data object in the form which is accepted by mailchip.
    const data={
        members : [{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:fname,
                LNAME:lname
            }
        }]
    };
    const jsonData= JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/8d61589a14";

    const options = {
        method:"POST",
        auth : "saquib:5594fa7bf3cc2ac86af94be289958c86-us14"
    }

    const request = https.request(url,options,function (response) {

        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function (data) { 
            console.log(JSON.parse(data));
            
         })
      })

      request.write(jsonData);
      request.end();

    // client.setConfig({
    //     apiKey: "5594fa7bf3cc2ac86af94be289958c86-us14",
    //     server: "us14",
    //   });
      
    //   const run = async () => {
    //     const response = await client.lists.batchListMembers("8d61589a14", {
    //         members : [{
    //             email_address:email,
    //             status:"subscribed",
    //             merge_fields:{
    //                 FNAME:fname,
    //                 LNAME:lname
    //             }
    //         }]
    //     });
    //     console.log(response);
    //   };
      
    //   run();
})

app.post("/failure",function(req,res){
    res.redirect("/");
})




