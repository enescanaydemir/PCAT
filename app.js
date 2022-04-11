const express = require('express')
const mongoose = require('mongoose')

const ejs = require('ejs')
const path = require('path')
const Photo = require('./models/Photo')

const app = express()


//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


//TEMPLATE ENGINE
app.set("view engine", "ejs")


// MIDDLEWARES
app.use(express.static('public'))
    // Aşağıda yazdığımız middlewareler req,res döngüsünde aldığımız requesti sonlandırmamıza yardımcı oldu. Bunları kullanmadığımızda request dönüyordu ancak response alamıyorduk.
app.use(express.urlencoded({ extended: true })) // urlencoded = url'deki datayı okumamızı sağlıyor
app.use(express.json()) // url deki datayı JSON formatına döndürmemizi sağlıyor.


// ROUTES
app.get('/', async(req, res) => { //Aşağıda yorum satırında bahsettiğim olayların async şekilde gerçekleşmesi için async ekledim
    const photos = await Photo.find({}) // Ana sayfada fotoğrafların dinamik olarak gömülmesini istediğimiz için bu satırda fotoğrafları yakalıyoruz(find() -> sıralamya yarar)
    res.render('index', { // Yukarıda yakaladığımız fotoğrafları template'e gönderiyoruz.
        photos: photos // burada objenin anahtar kelimesi ve değeri aynı olduğu zaman tek kelime olarak yazarız(photos) ancak burada kafa karışıklığı olmasın diye böyle yazdım 
    })
})
app.get('/about', (req, res) => {
    res.render('about')
})
app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/photos', async(req, res) => { // bir sıkışıklığa ve karışıklığa sebep olmasın diye async yapıya çevirdik
    await Photo.create(req.body) // Model yardımıyla veritabanında oluşturduğumuz document olana kadar await durumunda olacak
    res.redirect('/') // console'a yazdıktan sonra ana sayfaya dönmesini söyledik(index e redirect etmek)
})



const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portu ile başlatıldı`);
});