module.exports = function () {
    return {
        environment: process.env.NODE_ENV || "development",
        server:{
            port: process.env.SERVER_PORT || 3000
        },
        modes: {
            development:'development',
            production:'production'
        },
        mongo:{
            database: process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/development'
        }
    }
}();
