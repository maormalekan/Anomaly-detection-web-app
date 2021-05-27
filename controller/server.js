const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const bp = require('body-parser');
const model = require('../model/model')
const fs = require('fs');
const path = require("path");


app.use(bp.json());
app.use(bp.urlencoded({extended: true}));
app.use(fileUpload({}));
app.use(express.static('view'));


//starting server on port 8080
app.listen(8080);


app.get('/', function (req, res) {
    res.sendFile('index.html');
})

app.post('/detect', function (req, res) {
    if (req.files && req.body.detection_algorithms != null) {
        if (!req.files.proper_file)
            res.send('<h1>Upload a proper file!</h1>').status(404).end();
        else if (!req.files.detect_file)
            res.send('<h1>Upload a detect file!</h1>').status(404).end();
        else {
            let proper_file = req.files.proper_file;
            let detect_file = req.files.detect_file;
            let model_type = req.body;
            let proper_dict = model.createDict(proper_file.data.toString());
            let detect_dict = model.createDict(detect_file.data.toString());
            model.learn(proper_dict, model_type);
            let result = model.detect(detect_dict, model_type);
            const json = JSON.stringify(result, null, 4);
            fs.writeFileSync('view/result.json', json);
            res.sendFile(path.join(process.cwd(),'/view/result.html'));
        }
    } else if (req.body.detection_algorithms != null)
        res.send('<h1> Upload proper and detect files!</h1>').status(404).end();
    else if (req.files)
        res.send('<h1> Choose an algorithm!</h1>').status(404).end();
    else
        res.send('<h1> Choose an algorithm and upload files!</h1>').status(404).end();

})









