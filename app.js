const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')

const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const Photo = require('./models/Photo')

const app = express()

//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//TEMPLATE ENGINE
app.set('view engine', 'ejs')

// MIDDLEWARES
app.use(express.static('public'))
    // Aşağıda yazdığımız middlewareler req,res döngüsünde aldığımız requesti sonlandırmamıza yardımcı oldu. Bunları kullanmadığımızda request dönüyordu ancak response alamıyorduk.
app.use(express.urlencoded({ extended: true })); // urlencoded = url'deki datayı okumamızı sağlıyor
app.use(express.json()) // url deki datayı JSON formatına döndürmemizi sağlıyor.
app.use(fileUpload())

// ROUTES
app.get('/', async(req, res) => {
    const photos = await Photo.find({}).sort('-dateCreated')
    res.render('index', {
        photos: photos,
    })
})

app.get('/photos/:id', async(req, res) => {
    //console.log(req.params.id)
    //res.render('about')
    const photo = await Photo.findById(req.params.id)
    res.render('photo', {
        photo,
    })
})

app.get('/about', (req, res) => {
    res.render('about')
})
app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/photos', async(req, res) => {
    //console.log(req.files.image)
    // await Photo.create(req.body)
    // res.redirect('/')

    const uploadDir = 'public/uploads'

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
    }

    let uploadeImage = req.files.image; //görselin bilgilerini yakalayarak uploadedImage değişkenine gönderdik
    let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name; //public klasörünün içerisinde uploads dosyası oluşturduk ve bunun için yukarıda bilgilerini aldığımız görselin ismini ekledik

    uploadeImage.mv(uploadPath, async() => { // Yüklemesini istediğimiz klasörü .mv ile belirtebiliyoruz. Bunun içerisine 1. parametre olarak nereye eklemesi gerektiği dosyayı yazıyoruz. 2. parametre ise görseli istediğimiz dosyaya kaydettikten sonra bize dosya yolunu belirtecek(image: '/uploads/' + uploadeImage.name) 
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadeImage.name,
        })
        res.redirect('/')
    })
})

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portu ile başlatıldı`)
})