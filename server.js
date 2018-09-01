const express = require('express');
const app = express();
const config = require('./config');

app.get('/', (req, res) =>{
    res.send('Home page');
});

app.listen(config.server.port, function () {
    console.log('App listening on port ' + config.server.port);
});
