const express = require('express');
const app = express();
const config = require('./config');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '1mb'}));

mongoose.connect(config.mongo.database,{useNewUrlParser: true},
    (err) => {
        if (err) throw err;
        console.log('Successfully connected');
    }
);

require('./routes/auth.route')(app);
require('./routes/user.route')(app);
require('./routes/world.route')(app);

app.listen(config.server.port, function () {
    console.log('App listening on port ' + config.server.port);
});
