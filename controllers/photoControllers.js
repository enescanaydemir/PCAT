const Photo = require('../models/Photo')
const fs = require('fs')

exports.getAllPhotos = async(req, res) => {

    const page = req.query.page || 1
    const photosPerPage = 2 //sayfada bulunan fotoğraf sayısı

    //Datada bulunan döküman sayılarını(dataya eklenen verilerin sayısını) bulma işlemi;
    const totalPhotos = await Photo.find().countDocuments() //tüm fotoğrafları(documents) bulup onları sayıyor; (yani ana sayfada kaç tane fotoğraf eklediysek o kadar sayacak)

    //Her bir sayfada gösterilecek fotoğrafları yakalayacağız;
    const photos = await Photo.find({}) //ikili await yapısı kullandık.
        .sort('-dateCreated')
        .skip((page - 1) * photosPerPage) //Her sayfada 2 fotoğraf gösteriyoruz. Sayfa sıralarken 1. sayfada 1. ve 2. fotoğrafı gösterip, 2. sayfada 3. ve 4. fotoğrafı gösterebilmesi için ilk sayfada gösterdiği 1. ve 2. fotoğrafı atlaması lazım. Bunu skip fonksiyonu ile yapıyoruz. ".skip((page(sayfa sırası)-1) * photosPerPage(sayfadaki fotoğraf sayısı))" soldaki işlem; .skip((2-1) * 2) 1 ve 2 yi pas geç diyoruz. 
        .limit(photosPerPage) //her sayfada kaç tane gösterilmesini istiyorsak .limit fonksiyonu ile içine parametre olarak göndererek belirliyoruz.
    res.render('index', {
        photos: photos,
        current: page, //current = o anda bulunan sayfaya karşılık geliyor
        pages: Math.ceil(totalPhotos / photosPerPage) // pages = toplam sayfa sayımız. Bunu bulabilmek için "totalPhotos / photosPerPage" işlemini yapıyoruz yani total fotoğraf sayısını sayfadaki fotoğraf sayısına bölüyoruz. yani 5 fotoğrafımız var ve her sayfada 2 tane var 5/2 den 2.5 onu da Math.ceil ile 3 e yuvarlıyoruz. 
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