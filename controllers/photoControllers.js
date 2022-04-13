const Photo = require('../models/Photo')
const fs = require('fs')

exports.getAllPhotos = async(req, res) => {
    const photos = await Photo.find({}).sort('-dateCreated')
    res.render('index', {
        photos: photos,
    })
}

exports.getPhoto = async(req, res) => {
    const photo = await Photo.findById(req.params.id)
    res.render('photo', {
        photo,
    })
}

exports.creatPhoto = async(req, res) => {
    const uploadDir = 'public/uploads'

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
    }

    let uploadeImage = req.files.image //görselin bilgilerini yakalayarak uploadedImage değişkenine gönderdik
    let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name //public klasörünün içerisinde uploads dosyası oluşturduk ve bunun için yukarıda bilgilerini aldığımız görselin ismini ekledik

    uploadeImage.mv(uploadPath, async() => {
        // Yüklemesini istediğimiz klasörü .mv ile belirtebiliyoruz. Bunun içerisine 1. parametre olarak nereye eklemesi gerektiği dosyayı yazıyoruz. 2. parametre ise görseli istediğimiz dosyaya kaydettikten sonra bize dosya yolunu belirtecek(image: '/uploads/' + uploadeImage.name)
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadeImage.name,
        });
        res.redirect('/')
    })
}

exports.updatePhoto = async(req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id })
    photo.title = req.body.title
    photo.description = req.body.description
    photo.save()

    res.redirect(`/photos/${req.params.id}`)
}

exports.deletePhoto = async(req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id })
    let deletedImage = __dirname + '/../public' + photo.image
    fs.unlinkSync(deletedImage) //silme işlemi
    await Photo.findByIdAndRemove(req.params.id) //datadan silme işlemi
    res.redirect('/')
}