const express = require('express');
const app = express();
const config = require('./config');

require('./routes/auth.route')(app);
require('./routes/user.route')(app);
require('./routes/world.route')(app);

app.listen(config.server.port, function () {
    console.log('App listening on port ' + config.server.port);
});
