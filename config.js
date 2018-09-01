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
        },
        tokenSettings:{
            refresh:{
                maxValidTimeInSeconds:24*3600,
                maxUsage:1
            },
            access:{
                maxValidTimeInSeconds:3600,
                maxUsage:1
            }
        }
    }
}();
