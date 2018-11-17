const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ recentChats: [], profile: {}, allFriends: [] })
  .value()
const app = express();
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());

app.get('/profile', (request, response) => {
  var profile = db.get('profile').value()
  response.status(200).send(profile)
});
app.get('/recentChats/:id', (request, response) => {
  var recentChatsById = db.get('recentChats').find({ id: parseInt(request.params.id) }).value();
  var filtered = recentChatsById.chatlog.filter(function (el) {
    return el != null;
  });
  response.status(200).send(filtered)
});
app.post('/addChats/:id', (request, response) => {
  var d = new Date();
  var recentChats = db.get('recentChats').find({ id: parseInt(request.params.id) }).value();
  var chat = {
    "text": request.body.text,
    "timestamp": d.toISOString(),
    "side": request.body.side,
    "message_id": ++recentChats.chatlog.length
  };
  recentChats.chatlog.push(chat)
  var filtered = recentChats.chatlog.filter(function (el) {
    return el != null;
  });
  var newvalue = db.get('recentChats').find({ id: request.params.id })
    .assign({ chatlog: filtered })
    .write();
  response.status(200).send(newvalue)
});
app.get('/allFriends', (request, response) => {
  var allFriends = db.get('allFriends').value()
  response.send(allFriends)
});
const server = app.listen(process.env.PORT || 8080, _ => {
  console.log('Server started');
});
