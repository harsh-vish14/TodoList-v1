const express = require("express");
const bodyParser = require("body-parser");
const day = require(__dirname + "/date.js")

const app = express();

// this is setup part of server
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// creating two list for saving data 1 for home and other for work page
var ListItems = [];
var workListItems = [];

// this is post request for home route to get data and redirecting that data
app.post("/", (req, res) => {
    let item = req.body.textValue;
    console.log(req.body);

    // checking whether that data is coming from home page of work page
    if (req.body.button === "Work") {
        workListItems.push(item);
        res.redirect("/work");
    }
    else {
        ListItems.push(item);
        res.redirect("/");
    }
    
});

// this is get request for home route
app.get("/", function (req, res) {
    res.render("list", { Title: day.getDate, ListItems: ListItems });

});

// this is get request for work page
app.get("/work", function (req, res) {
    res.render("list", { Title: "Work", ListItems: workListItems })
});

// this is get request for about page
app.get("/about", function (req, res) {
    res.render("about");
});

// we are using app.listen to get the server running to given port and making port ready for production
app.listen(process.env.PORT || 3000, () => {
    console.log("port/server is running");
})