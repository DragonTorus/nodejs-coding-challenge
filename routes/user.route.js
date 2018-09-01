const controller = require('../controllers/user.controller');

module.exports = (app) =>{
    app.get('/user', controller.getAllUsers);
    app.get('/user/:id', controller.getUserById);
    app.put('/user/:id', controller.updateUser);
    app.post('/user', controller.createUser);
};
