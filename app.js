const express = require("express");
const bodyParser = require("body-parser");
// const day = require(__dirname + "/date.js")
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

// this is setup part of server
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// creating two list for saving data 1 for home and other for work page
mongoose.connect("mongodb://localhost:27017/TodoListDB", { useNewUrlParser: true, useUnifiedTopology: true });

const listItems = {
    name: String,
};
const Item = mongoose.model("item", listItems);

const ListSchema = {
    name: String,
    items: [listItems]
}

const listSchema = mongoose.model("list", ListSchema);

// this is post request for home route to get data and redirecting that data
app.post("/", (req, res) => {
    let itemname = req.body.textValue;
    let ListName = req.body.button;
    var item = new Item({
        name: itemname
    });

    if (ListName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        listSchema.findOne({ name: ListName }, function (err, foundList) {
            if (!err) {
                foundList.items.push(item);
                foundList.save();
                res.redirect(`/${ListName}`);
            } else {
                console.log(err);
            }
        })
    }

});

app.post("/delete", (req, res) => {
    const checkboxValue = req.body.checkboxName;
    const ListName = req.body.ListName;
    if (ListName === "Today") {
        Item.findByIdAndRemove({ _id: checkboxValue }, function (err) {
            if (err) {
                console.log(err);
            } else {

                console.log("done");
            }
            
        })
        res.redirect("/");
        console.log(req.body);
    } else {
        listSchema.findOneAndUpdate({ name: ListName }, { $pull: { items: { _id: checkboxValue } } }, function (err, foundList) {
            if (!err) {
                res.redirect(`/${ListName}`);
            }
        });
    }
})

const item1 = new Item({
    name: "Welcome To todoList"
})
const item2 = new Item({
    name: "you can add item from input a text and press +"
})
const item3= new Item({
    name: "<-- press this to delete item from list"
})

const defaultItem = [item1, item2, item3];

// this is get request for home route
app.get("/", function (req, res) {
    Item.find({}, (err, data) => {
            res.render("list", { Title: "Today", ListItems: data });
        console.log(data);
    });

});

// this is get request for about page
app.get("/about", function (req, res) {
    res.render("about");
});

app.get(`/:newList`, (req, res) => {
    const Listname = _.capitalize(_.kebabCase(req.params.newList));
    if (Listname !== "Today") {
        listSchema.findOne({ name: Listname }, function (err, docs) {
        if (!err) {
            if (!docs) {
                const list = new listSchema({
                    name: Listname,
                    items: defaultItem
                })
                list.save();
                res.redirect(`/${Listname}`);
            } else {
                res.render("list", { Title: _.capitalize(_.lowerCase(docs.name)), ListItems: docs.items });
            }
        }
    })
    } else {
        res.redirect("/")
    }
})

// we are using app.listen to get the server running to given port and making port ready for production
app.listen(process.env.PORT || 3000, () => {
    console.log("port/server is running");
})