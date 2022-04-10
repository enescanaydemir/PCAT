const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


//create Schema
const photoSchema = new Schema({
    title: String,
    description: String,
})

const Photo = mongoose.model('Photo', photoSchema)


//create a photo (photo içinde dataları oluşturuyoruz.)
Photo.create({
    title: "Photo Title 2",
    description: "Photo description 2 lorem ipsum",
})

//read a photo (verileri okuma)
Photo.find({}, (err, data) => { //callback fonksiyonu içierisine 2 parametre. err ve data. datayı console için çağırdık.
    console.log(data);
})

//update a photo
const id = "6252a4e3e43b2759505f3aec";

Photo.findByIdAndUpdate(
    id, { // 1.parametre olarak id aldık, 2. parametre olarak yapmak istediğimiz değişiklikleri yazdık
        title: "Photo title 111 updated",
        description: "Photo description 111 updated"
    }, {
        new: true //bunu yazmadan önce console'da güncel veri gözükmüyordu. Bunu yazarak console a güncel verinin gelmesini sağladık.
    },
    (err, data) => { //callback function
        console.log(data)
    }
)

// delete a photo
const id = '6252a627a73de99f218bbfb5';

Photo.findByIdAndDelete(id, (err, data) => {
    console.log('Photo is removed...')
})