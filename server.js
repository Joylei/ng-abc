var express = require('express');
var Static = require('express-static');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();

app.set('port', 8080);
app.use(Static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

function logerror(err){
  if(err){
    console.log('----');
    console.error(err.message);
    console.error(err.stack);
  }
}

app.get('/todos',function(req,res){
  var dataFile = path.join(__dirname, 'data', 'todos.json');
  fs.readFile(dataFile, 'utf8', function (err,data) {
    if (err) {
      logerror(err);
      return res.json([]);
    }
    console.log(data);
    try{
      var todos = JSON.parse(data);
      return res.json(todos);
    }catch(err2){
      logerror(err2);
    }
    return res.json([]);
  });
});

app.post('/todos',function(req,res){
  var dataFile = path.join(__dirname, 'data', 'todos.json');

  var text = JSON.stringify(req.body || []);
  fs.writeFile(dataFile, text, function (err,data) {
    if (err) {
      logerror(err);
      return res.status(500).end();
    }
    console.log(data);
    res.status(200).end();
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
