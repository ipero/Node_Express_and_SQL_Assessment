var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var animals = require('./routes/animals.js');

// bring in pg module
var pg = require('pg');
var connectString = '';

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/zoo';
}

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('Error connecting to DB!', err);
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS animals (' +
    'id SERIAL PRIMARY KEY,' +
    'name varchar(80) NOT NULL);'
  );

  query.on('end', function(){
    console.log('Successfully ensured schema exists');
    done();
  });

  query.on('error', function() {
    console.log('Error creating schema!');
    //TODO exit(1)
    done();
  });
}
});

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/animals', animals);


app.get('/*', function(req, res){
  var filename = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '/public/', filename)); 
});

app.listen(port, function(){
  console.log('Listening for requests on port', port);
});
