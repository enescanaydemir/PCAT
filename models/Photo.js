// Bu dosyada app.js içerisinden alacağımız add.post içerisindeki req.body'yi yani add photo sayfasında yüklenecek fotoğrafı burada şekil vereceğiz.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const photoSchema = new Schema({
    title: String,
    description: String,
    image: String, //adresleri olacağı için String tipte verdik
    dateCreated: {
        type: Date,
        default: Date.now, //yüklenme tarihini varsayılan tarih olarak almasını istedik
    }
})

const Photo = mongoose.model('Photo', photoSchema)

module.exports = Photo