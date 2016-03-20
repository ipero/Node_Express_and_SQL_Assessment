var express = require('express');
var animals = express.Router();
var path = require("path");
var pg = require("pg");
var randomNumber = require('./randomnum.js');

var connectString = '';

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectString = process.env.DATABASE_URL;
}else{
  connectString = 'postgres://localhost:5432/zoo';
}

// GET DATA FROM DB
animals.get('/', function(req,res){
  pg.connect(connectString, function(err, client, done){
    if(err){
      done();
      console.log('Error connecting to DB ', err);
      res.status(500).send(err);
    }else{
      var result = [];
      var query = client.query('SELECT * FROM animals;');

      query.on('row', function(row){
        result.push(row);
      });
      query.on('end', function(){
        done();
        res.send(result);
      });
      query.on('error', function(error){
        console.log('Error running query: ', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

// ADD NEW ANIMAL TO DB
animals.post('/', function(req, res){

  pg.connect(connectString, function(err, client, done){
    if(err){
      done();
      console.log('Error connecting to DB ', err);
      res.status(500).send(err);
    }else{

      var query = client.query('INSERT INTO animals (animal_type, quantity) '+
      'VALUES ($1, $2)' +
      'RETURNING id, animal_type', [req.body.name, randomNumber(1,100)]);

      query.on('end', function() {
        done();
        res.status(200).send();
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

module.exports = animals;
