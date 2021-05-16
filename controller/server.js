const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const bp = require('body-parser');
const model = require('../model/model')

app.use(bp.json());
app.use(bp.urlencoded({extended: true}));
app.use(fileUpload({}));
app.use(express.static('../view'));


//starting server on port 8080
app.listen(8080, () => console.log("Web app listening at 8080"));


app.get('/', function (req, res) {
    res.sendFile('index.html')
})

app.post('/detect', function (req, res) {
    if (req.files) {
        let proper_file = req.files.proper_file;
        let detect_file = req.files.detect_file;
        let model_type = req.body;
        let proper_dict = model.createDict(proper_file.data.toString());
        let detect_dict = model.createDict(detect_file.data.toString());
        model.learn(proper_dict, model_type);
        let result = model.detect(detect_dict, model_type);
        res.write(JSON.stringify(result, null, 1));
        res.status(200).end();
    } else
        res.status(404).end();
})








