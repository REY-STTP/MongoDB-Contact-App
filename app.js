const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { body, validationResult, check, Result } = require('express-validator')
const methodOverride = require('method-override')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const chalk = require('chalk')

const Connection = require('./utils/koneksi')
const Contact = require('./model/contact')

const app = express()
const port = 3000

// Setup Method Override
app.use(methodOverride('_method'))

// Gunakan ejs
app.set('view engine', 'ejs')

// Third-Party Middleware
app.use(expressLayouts)

// Built in Middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// Konfigurasi Flash
app.use(cookieParser('secret'))
app.use(
     session({
          cookie: { maxAge: 6000 },
          secret: 'secret',
          resave: true,
          saveUninitialized: true,
     })
)
app.use(flash())

// Layout
app.get('/', (req, res) => {
    res.render('index', {
         title: 'Home',
         layout: 'layouts/main-layouts.ejs',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
         title: 'About',
         layout: 'layouts/main-layouts.ejs',
    })
})

app.get('/contact', async (req, res) => {

    const contacts = await Contact.find()

    res.render('contact', {
         title: 'Contact',
         layout: 'layouts/main-layouts.ejs',
         contacts,
         msg: req.flash('msg'),
    })
})

// Halaman form tambah data contact
app.get('/contact/add', (req, res) => {

    res.render('add-contact', {
         title: 'Form Tambah Data Contact',
         layout: 'layouts/main-layouts.ejs',
    })
})

// Proses Tambah Data Contact
app.post('/contact', 
[
     body('nama').custom(async (value) => {
          const duplikat = await Contact.findOne({ nama: value })
          if (duplikat) {
               throw new Error('Nama contact telah digunakan.')
          }
          return true
     }),
     check('email', 'Email tidak valid.').isEmail(),
     check('nohp', 'No HP tidak valid.').isMobilePhone('id-ID'),
],
async (req, res) => {
     const errors = validationResult(req)
     if (!errors.isEmpty()) {
          res.render('add-contact', {
               title: 'Form Tambah Data Contact',
               layout: 'layouts/main-layouts.ejs',
               errors: errors.array(),
          })
     } else {
        await Contact.insertMany([req.body])
        req.flash('msg', `Data contact ${req.body.nama} berhasil ditambahkan!`)
        res.redirect('/contact')
    }
})

// Proses Delete Contact
app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then(() => {
        req.flash('msg', `Data contact ${req.body.nama} berhasil dihapus!`); 
        res.redirect('/contact');
    }) 
})

// Halaman Form Ubah Data Contact
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })

    res.render('edit-contact', {
         title: 'Form Ubah Data Contact',
         layout: 'layouts/main-layouts.ejs',
         contact,
    })
})

// Proses ubah data contact
app.put('/contact', 
[
     body('nama').custom(async (value, { req }) => {
          const duplikat = await Contact.findOne({ nama: value })
          if (value !== req.body.oldNama && duplikat) {
               throw new Error('Nama contact telah digunakan.');
          }
          return true;
     }),
     check('email', 'Email tidak valid.').isEmail(),
     check('nohp', 'No HP tidak valid.').isMobilePhone('id-ID'),
],
(req, res) => {
     const errors = validationResult(req)
     if (!errors.isEmpty()) {

          res.render('edit-contact', {
               title: 'Form Ubah Data Contact',
               layout: 'layouts/main-layouts.ejs',
               errors: errors.array(),
               contact: req.body,
          });
     } else {
          Contact.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    nama: req.body.nama,
                    nohp: req.body.nohp,
                    email: req.body.email,
                    nickname: req.body.nickname,
                    gameID: req.body.gameID,
                    serverID: req.body.serverID,
                    highRank: req.body.highRank
                },
            },
          ).then(() => {
            // Kirimkan flash massage
            req.flash('msg', `Data contact ${req.body.nama} berhasil diubah!`)
            res.redirect('/contact')
          })
     }
})

// Halaman Detail Contact
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({nama: req.params.nama})

    res.render('detail', {
         title: 'Halaman Detail Contact',
         layout: 'layouts/main-layouts.ejs',
         contact,
    })
})

 // Middleware untuk menangani halaman 404
 app.use((req, res) => {
    res.status(404)
    res.render('error-msg', {
        title: 'Error 404',
        layout: 'error-msg.ejs',
    })
})

app.listen(port, () => {
     const listenMsg = chalk`{blue.bold MongoDB Contact App} {red.bold listening at {underline http://localhost:${port}}}`
     console.log(chalk(listenMsg))
  })