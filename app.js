const express = require('express');
const path = require('path');

const app = express();


/*
const myLogger = (req, res, next) => {
    console.log("Middleware Log 1");
    next(); // Middleware'lar sırayla çalışır biz burada next yazmazsak bir sonraki middleware'e(app.get) geçmez.
}

const myLogger2 = (req, res, next) => {
    console.log("Middleware Log 2");
    next();
}
*/


// MIDDLEWARES
app.use(express.static('public'))
    // app.use(myLogger);
    // app.use(myLogger2)


app.get('/', (req, res) => { //get requestleri genelde verileri listelemek için kullanırız. Post ise veri göndermek için kullanılır.
    res.sendFile(path.resolve(__dirname, 'temp/index.html'));
})

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portu ile başlatıldı`);
});