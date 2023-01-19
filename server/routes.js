const router = require('express').Router();
const screenshot = require('desktop-screenshot');
const multer = require('multer');
const fs = require('fs');
const fileModal = require('./fileModal');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.webm');
    }
});
const upload = multer({ storage: storage });

router.get("/screenshot", async (req, res) => {
    screenshot("uploads/screenshot.png", function (error, complete) {
        if (error)
            res.send({ message: "Screenshot failed" });
        else
            res.send({ message: "Screenshot succeeded" });
    });
})

router.post('/take-photo', async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, img, alias } = req.body;
        const imagePath = `${Date.now()}.${Math.round(
            Math.random() * 1e9
        )}.png`;
        const buffer = Buffer.from(img.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
        fs.writeFile(`uploads/${imagePath}`, buffer, function (err) {
            if (!err) {
                console.log("file is created")
            }
        });
        const filepath = `uploads/${imagePath}`;
        let file = await fileModal.create({ alias, filename, filepath, date, time, latitude, longitude, filetype: 'take photo' });
        res.send({ message: "File Saved", file });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
})

router.post('/audio', upload.single('audio'), async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, duration, alias } = req.body;
        const filepath = `${req.file.path}`;
        let file = await fileModal.create({ alias, filename, filepath, date, time, latitude, longitude, duration, filetype: 'audio recording' });
        res.send({ message: "File Saved", file });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});

router.post('/videowith', upload.single('videowith'), async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, duration, alias } = req.body;
        const filepath = `${req.file.path}`;
        let file = await fileModal.create({ alias, filename, filepath, date, time, latitude, longitude, duration, filetype: 'video with audio recording' });
        res.send({ message: "File Saved", file });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});

router.post('/videowithout', upload.single('videowithout'), async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, duration, alias } = req.body;
        const filepath = `${req.file.path}`;
        let file = await fileModal.create({ alias, filename, filepath, date, time, latitude, longitude, duration, filetype: 'video without audio recording' });
        res.send({ message: "File Saved", file });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});

router.post('/screenwithout', upload.single('screenwithout'), async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, duration, alias } = req.body;
        const filepath = `${req.file.path}`;
        let file = await fileModal.create({ alias, filename, filepath, date, time, latitude, longitude, duration, filetype: 'screen without audio recording' });
        res.send({ message: "File Saved", file });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});

router.post('/screenwith', upload.single('screenwith'), async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, duration, alias } = req.body;
        const filepath = `${req.file.path}`;
        let file = await fileModal.create({ alias, filename, filepath, date, time, latitude, longitude, duration, filetype: 'screen with audio recording' });
        res.send({ message: "File Saved", file });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});

router.post('/aliasdata', async (req, res) => {
    try {
        const { alias } = req.body;
        let file = await fileModal.find({ alias })
        res.send({ message: `your aliascode ${alias} files`, file });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});

module.exports = router