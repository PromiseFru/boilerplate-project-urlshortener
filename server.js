'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

app.use(cors());

/** this project needs to parse POST bodies **/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

var urlSchema = new Schema({
  url : { type: String }
})

var Url = mongoose.model("Url", urlSchema);

// your first API endpoint... 
app.post('/api/shorturl/new', (req, res) => {
  var postUrl = req.body.url;

  dns.lookup(postUrl, (err) => {
      if(err) {
          return res.json({"error":"invalid URL"})
      }

      var createUrl = new Url({url: postUrl});
      createUrl
          .save()
          .then((doc) => {
              res.json({"original_url": doc.url, "short_url": doc._id});
          })
          .catch(err => console.log(err));
  })
})

app.get('/api/shorturl/:identifier', (req, res) => {
  var identifier = req.params.identifier;

  var findUrl = Url.findById(identifier);
  findUrl
      .then((doc) => {
          if(!doc) return res.sendStatus(404);

          res.redirect('https://' + doc.url);  
      })
      .catch(err => console.log(err));
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});