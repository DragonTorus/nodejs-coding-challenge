const controller = require('../controllers/world.controller');
const {isAuthenticated} = require('../services/authenticationMiddleware');

module.exports = (app) =>{
    app.get('/hello', isAuthenticated, controller.world);
};
