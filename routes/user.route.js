const controller = require('../controllers/user.controller');
const {isAuthenticated} = require('../services/authenticationMiddleware');
module.exports = (app) =>{
    app.get('/user', isAuthenticated, controller.getAllUsers);
    app.get('/user/:id', isAuthenticated, controller.getUserById);
    app.put('/user/:id', isAuthenticated, controller.updateUser);
    app.post('/user', controller.createUser);
};
