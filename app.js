// Mailchimp setup
const APIKEY = "78e610945b4d95677916db53519b12a6-us14";
const SERVER_PREFIX = "us14";
const mailchimpClient = require("@mailchimp/mailchimp_marketing");
mailchimpClient.setConfig({
  apiKey: APIKEY,
  server: SERVER_PREFIX,
});

// Express setup
const express = require("express");
const PORT = 3000;
const app = express();
app.use(express.static("public")); //Is needed to read static files (Css/images)
app.use(express.urlencoded({ extended: true }));

// server interactions with website
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

// Get name and email provided by user. Add it to mail list using mailchimp API. 
app.post("/", (req, res) => {
  const firstName = req.body.floatingFirstName;
  const lastName = req.body.floatingLasttName;
  const email = req.body.floatingInput;
  console.log(firstName, lastName, email);
  
  const addEmail = async () => {
    const response = await mailchimpClient.lists.addListMember("4c59710d4b", {
      email_address: email,
      merge_fields: {FNAME: firstName,LNAME: lastName,},
      status: "subscribed",
    });

    // getting unexpected crash here when trying to register duplicate email
    try {
        if(response.status === "subscribed"){
            console.log("Email added to newsletter");
            res.sendFile(`${__dirname}/success.html`)
        } else {
            console.log(response.title, response.type);
            res.sendFile(`${__dirname}/failure.html`)
        }}
    catch(err) {
        console.log(err.message)
    }
  };
  addEmail();
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
