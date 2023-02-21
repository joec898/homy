const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json())
app.use(cookieParser());
app.use('/uploads', express.static(__dirname +'/uploads')); // open uploads folder
app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:5173',
}))

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL,function(err) {
    if (err != null) {
        console.error("Error: " + err)
    } else {
        console.log(`MongoDB Connected: ${process.env.MONGO_URL}`)
    }
});

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
      jwt.verify(req.cookies.token, process.env.JWT_SECRET, {}, async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    });
}

app.get('/test', (req,res) => {
    res.json('test ok ....');
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if(err) throw err;
            const {name, email, _id} = await User.findById(userData.id);
            //console.log(name);
            res.json({name, email, _id});
        })
    } else {
        res.json(null);
    }
});

app.post('/login', async (req, res) => {
    const {email,password} = req.body;
    try{
        const userDoc = await User.findOne({email});
        if (userDoc) {
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (passOk) {
                jwt.sign({email:userDoc.email, id:userDoc._id},
                        process.env.JWT_SECRET, {}, (err, token) => {
                            if(err) throw err;
                            res.cookie('token', token).json(userDoc);
                });
            } else {
                res.status(422).json('pass not ok');
            }
        } else {
            res.json('not found');
        }
    } catch (e) {
        console.error('Error saving user...')
        res.status(422).json(e);
    }
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json(true);
});

app.post('/register', async (req, res) => {
    const {name,email,password} = req.body;
    try{
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        });
        console.log('user created. ' + userDoc);
        res.json(userDoc);
    } catch (e) {
        console.error('Error saving user...')
        res.status(422).json(e);
    }
});

app.post('/upload-by-link2', async (req,res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
      url: link,
      dest: __dirname + '/uploads/' +newName,
    });
    res.json(newName);
});

  app.post('/upload-by-link', async (req,res) => {
    const {link} = req.body;
    const options = {
        url: link,
        dest: __dirname + '/uploads',
        extractFilename: true,        // will be saved to ../uploads/original_file_name
    };
    await imageDownloader.image(options)
    .then(({filename}) => {
        console.log('Saved to', filename)
        const parts = filename.split('\\');
        filename = parts[parts?.length-1];
        console.log('returned file name:', filename)
        res.json(filename);
    })
    .catch((err) => console.error(err));
  });

const photoMiddleware = multer({dest:'uploads/'})
app.post('/upload', photoMiddleware.array('photos',50), (req,res) =>{
    const uploadedFiles = [];
    for(let i=0; i<req.files.length; i++) {
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\',''));
        console.log(uploadedFiles);
    }
    res.json(uploadedFiles);
  });

app.get('/user-places', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      const {id} = userData;
      res.json( await Place.find({owner:id}) );
    });
  });

app.get('/places/:id', async (req,res) => {
    const {id} = req.params;
    res.json(await Place.findById(id));
});

app.get('/places', async (req,res) => {
    res.json( await Place.find() );
});

app.post('/places', async (req,res) => {
    const {title, address, addedPhotos, description,perks,
           extraInfo, checkIn, checkOut, maxGuests,price,
    } = req.body;
    const {token} = req.cookies;
    console.log(addedPhotos);
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if(err) throw err;
            const placeDoc = await Place.create({
                owner:userData.id,
                title, address, photos:addedPhotos, description,perks,
                extraInfo, checkIn, checkOut, maxGuests, price,
            })
            res.json(placeDoc)
        })

    } else {
        res.json(null);
    }
});

app.put('/places', async (req,res) => {
    const {token} = req.cookies;
    const {
      id, title,address,addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,price,
    } = req.body;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.findById(id);
      if (userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          title,address,photos:addedPhotos,description,
          perks,extraInfo,checkIn,checkOut,maxGuests,price,
        });
        await placeDoc.save();
        res.json('ok');
      }
    });
});

app.post('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const {
      place,checkIn,checkOut,numberOfGuests,name,phone,price,
    } = req.body;
    Booking.create({
      place,checkIn,checkOut,numberOfGuests,name,phone,price,
      user:userData.id,
    }).then((doc) => {
      res.json(doc);
    }).catch((err) => {
      throw err;
    });
  });

  app.get('/bookings', async (req,res) => {
    const userData = await getUserDataFromReq(req);
    res.json( await Booking.find({user:userData.id}).populate('place') );
  });

app.listen(4000);