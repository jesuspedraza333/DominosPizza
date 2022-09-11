const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const { applyEach } = require('async');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const { redirect } = require('express/lib/response');
const res = require('express/lib/response');
const url = "mongodb+srv://harryfora:maki12te@cluster0.yswxu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;

mongoClient.connect(url, function (err, db) {
    if (err) res.send(err);
    console.log("Database created!" + db.db);
});
// gestor de la url
app.use(bodyParser.urlencoded({ extended: true }));
// puerto donde se ejecuta
// app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// indicar donde estan los elemntos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// operaciones get
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/pedido', (req, res) => {
    res.render('pages/pedido');
});

app.get('/menu', (req, res) => {

    res.render('pages/menu');
});

app.get('/login', (req, res) => {
    mongoClient.connect(url, function (err, db) {
        if(err) res.send(err);
        var dbo = db.db("mydb");
        dbo.collection('users').find({}).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            res.render('pages/login', { datos: JSON.stringify(result) });
        });

    });


});

app.get('/tablas', (req, res) => {
    // conectar a la base de datos
    mongoClient.connect(url, function (err, db) {
        if(err) res.send(err);
        var dbo = db.db("mydb");
        dbo.collection('pedidos').find({}).toArray(function (err, result) {
            if (err) throw err;
            res.render('pages/tablas', { datos: JSON.stringify(result) });
            db.close();
        });

    });

});

// cuando se inicia el servidor
app.listen(port, host, () => {
    console.log('Ejecutando servidor');
});

// metodos post

app.post('/menu', (req, res) => {
    if ('' == req.body.cedula || 'sd' == req.body.departamento || 'ciudad' == req.body.ciudad || 'direccion' == req.body.direccion || '' == req.body.barrio || 'si' == req.body.TipoImnu || 'si' == req.body.bloque) {
        res.render("pages/pedido");
    } else {

        let redir = `pages/menu?cedula=${req.body.cedula}&ciudad=${req.body.departamento + ";" + req.body.ciudad}&direccion=${req.body.direccion + " " + req.body.primero + " " + req.body.segundo + " " + req.body.tercero + " " + req.body.barrio + " " + req.body.TipoImnu + " " + req.body.bloque}&observaciones=${req.body.observaciones}&estado=Procesando`;

        res.render(`pages/menu`, {
            cedula: req.body.cedula,
            ciudad: req.body.departamento + ";" + req.body.ciudad,
            direccion: req.body.direccion + " " + req.body.primero + " " + req.body.segundo + " " + req.body.tercero + " " + req.body.barrio + " " + req.body.TipoImnu + " " + req.body.bloque,
            observaciones: req.body.observaciones,
            estado: "Procesando"
        });
    }
});

app.post('/procesarPedido', (req, res) => {
    mongoClient.connect(url, (err, db) => {
        if(err) res.send(err);
        var dbo = db.db("mydb");
        dbo.collection('pedidos').insertOne({
            cedula: req.body.cedula,
            ciudad: req.body.ciudad.split("+").join(" "),
            direccion: req.body.direccion.split("+").join(" "),
            observaciones: req.body.observaciones.split("+").join(" "),
            estado: "Procesando",
            productos: req.body.lista
        });

    });

    res.redirect("/");
});

app.post('/login', (req, res) => {
 
    res.redirect('/tablas');
});

app.post('/actualizarTabla', (req, res) => {

    mongoClient.connect(url, function (err, db) {
        if (err)  res.send(err);
        var dbo = db.db("mydb");
        var myquery = { cedula: req.body.id };
        var newvalues = { $set: { estado: req.body.estado} };
        dbo.collection("pedidos").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
    res.redirect('/tablas');
});


// crear base de datos
/*



mongoClient.connect(url, function (err, db) {
    var dbo = db.db("mydb");
    dbo.collection('pedidos').find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result)
        db.close();
    });

});                  
*/