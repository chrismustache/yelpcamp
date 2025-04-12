const mongoose = require('mongoose');
const campgrounds = require("../models/campgrounds");
const seedHelpers = require("./seedHelpers");
const seeds = require("./seeds");
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {console.log("Connected to Database")})




let seedDB = async () => {
    await campgrounds.deleteMany({});
    
    console.log("Database deleted");
    

    for (i=0 ; i<50 ; i++) {
        let randomN =  Math.floor(Math.random()*1000);

        let randomD =  Math.floor(Math.random() * seedHelpers.descriptors.length);

        let randomPrice = Math.floor(Math.random()*80)


        let camp = new campgrounds ({
                                     name: `${seedHelpers.descriptors[randomD]} ${seedHelpers.places[randomD]}` , 
                                     location: `${seeds[randomN].city}, ${seeds[randomN].state}` ,
                                     price: randomPrice,
                                     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores nesciunt veritatis nostrum sint voluptatibus iste laborum. Odit, id. Sint, esse.",
                                     Images: {filename:"lja4w14wf0odsz6zauxe",
                                              url: "https://res.cloudinary.com/dvlxwb5j5/image/upload/v1726909150/lja4w14wf0odsz6zauxe.jpg"},
                                     author: "66159f7cbd85fabc50b0af10"}); 
        
        await camp.save();

        }
    
    
    }
    seedDB()
        .then(() => {
            mongoose.disconnect();
            console.log("Database disconnected");
        });
