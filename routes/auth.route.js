const controller = require('../controllers/auth.controller');

module.exports = (app) =>{
    app.post('/auth', controller.authenticateUser);
    app.post('/refresh-token', controller.refreshAcessToken);
};
