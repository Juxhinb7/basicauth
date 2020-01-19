const express = require("express"); //load the express module 
const app = express(); //call the express function
const password = require("password-hash-and-salt");  //load the module responsive for salting and hashing our passwords 

app.use(express.json()); //use json for our request body 

const users = []; //the user data will be inserted here

let hashed; //for the hashed password 

app.get("/users", (req, res) => { //main entry 
    res.json(users); //it will show our users data
});

app.post("/users", (req, res) => { //post request 

    password(req.body.password).hash((error, hash) => { //hash the requested password 
        if(error) throw new Error("Something went wrong!"); //throw an error if there is any

        hashed = hash; //the hashed password is stored to the hashed variable above;

    })

    const user = { name: req.body.name, password: hashed}; //an object with our user data
    users.push(user); //push the object to the users variable
    res.status(201).send();
});

app.post("/users/login", (req, res) => { //post request for login 
    const user = users.find(user => user.name = req.body.name) //find the user data that are stored 
    if (user == null) { //if there is no data of the user 
        res.status(400).send('Cannot find user'); //response with a statuscode of 400 and send a message that the user cannot be found
    }
    try { //try the following lines of code 
        password(req.body.password).verifyAgainst(hashed, (error, verified) => { //verify that our login password is the same as the registration password
            if (error) throw new Error("Something went wrong"); //if there is an error throw an error message that says something went wrong
            if (!verified) {  //if it's not verified 
                res.send("Not allowed"); //send 'Not allowed' as a message
            }
            else {
                res.send("Success!"); //else send 'Success!' 
            }
        })
    }
    catch { //if an error occurs
        res.status(500).send(); //respond with a statuscode of 500
    }
});

app.listen(3000); //start our application