if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const port = process.env.Port || 3000;
var today = new Date;
const mongoose = require('mongoose');
const e = require('express');
mongoose.connect('mongodb+srv://mohammedoyawoye:' + process.env.atlas_password +'@cluster0.ik7s9tq.mongodb.net/todoDB');
// mongoose.connection.dropDatabase().then(function () {
//     console.log("database dropped successfully");
// }).catch(function (err) {
//     console.log(err);
// })
const itemDbSchema= new mongoose.Schema({
    name:String,
    work:String,
});

// const workItemSchema = new mongoose.Schema(
//     {
//      name:String   
//     }
// );

// const WorkItem = mongoose.model('workItem', workItemSchema);
const Item = mongoose.model('item', itemDbSchema);
var currentDay= today.getDay();
const date = require(__dirname+"/date.js");
console.log(currentDay);
app =express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.listen(port, function() {
    console.log('server running on port ' + port);
});

app.get('/', function (req,res) {
    let day =date();
    Item.find({work:null}).then(function (items) {
        res.render('index', { kindOfDay: day, list: items, submit: 'todo' });
    }).catch(function (err) {
        if (err) {
            res.send(err)

        }
    });
});

app.post('/', function (req,res){
    var data=req.body;
    if (data.text != "" && data.button === "todo"){
    var item = new Item({
        name:data.text,
        work:null
    });
    item.save()
    res.redirect('/');
}
//    else if (data.text != "" && data.button === "work") {
//         var workItem = new WorkItem({
//             name:data.text
//         })

//         workItem.save();
//         res.redirect('/work');
//     } else {
//         if (data.button === "work") {
//             res.redirect('/work');
//         }
        else {
          res.redirect('/')
}
//     }
    
});

app.get('/:work', function (req, res) {
    var userWork = _.capitalize(req.params.work);
    var option = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    if (userWork === "todo") {
        res.redirect('/');
    } else {
    Item.find({work:userWork}).then(function (workItems) {
        res.render('index', { kindOfDay: userWork, list: workItems, submit: userWork });
    }).catch(function (err) {
        if (err) {
            res.send(err);
        }
    
});
}
});

app.post('/:work', function (req,res) {
    var data = req.body;
    var userWork = _.capitalize(req.params.work);
    if (data.text != "") {
        var item = new Item({
            name: data.text,
            work: userWork
        });
        item.save()
        res.redirect('/' + userWork)
    } else {
            res.redirect('/'+userWork)
        }

})

app.post('/delete/:part/:id', function(req,res) {
    var data = req.body;
    var id = req.params.id;
    var part = req.params.part;
    if (part === "todo") {
        part = null;
        Item.deleteOne({ _id: id, work: part }).then(function () {
            console.log('successfully deleted the data');
            res.redirect('/');
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        })

        } else {
        Item.deleteOne({_id:id, work:part}).then(function () {
            console.log('successfully deleted the data');
            res.redirect('/'+part);
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        })
    } 

//     } else {
//         WorkItem.deleteOne({ _id: id }).then(function () {
//             console.log('successfully deleted the data');
//             res.redirect('/work');
//         }).catch(function (err) {
//             console.log(err);
//             res.send(err);
//         })
//     }
    
})
