const controller = require('../controllers/world.controller');

module.exports = (app) =>{
    app.post('/hello', controller.world);
};
