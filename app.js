const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();

//TEMPLATE ENGINE
app.set("view engine", "ejs");


// MIDDLEWARES
app.use(express.static('public'))
    // Aşağıda yazdığımız middlewareler req,res döngüsünde aldığımız requesti sonlandırmamıza yardımcı oldu.
app.use(express.urlencoded({ extended: true })) // urlencoded = url'deki datayı okumamızı sağlıyor
app.use(express.json()) // url deki


// ROUTES
app.get('/', (req, res) => {
    res.render('index')
})
app.get('/about', (req, res) => {
    res.render('about')
})
app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/photos', (req, res) => {
    console.log(req.body);
    res.redirect('/') // console'a yazdıktan sonra ana sayfaya dönmesini söyledik(index e redirect etmek)
})

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portu ile başlatıldı`);
});