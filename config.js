module.exports = function () {
    return {
        environment: process.env.NODE_ENV || 'development',
        server:{
            port: process.env.SERVER_PORT || 3000
        },
        modes: {
            development:'development',
            production:'production'
        },
        mongo:{
            database: process.env.MONGO_CONNECTION || 'mongodb+srv://mati-demo-user:ztSEsYYDR1CLJbR6@cluster0-yateh.mongodb.net/test?retryWrites=true/development'
        },
        tokenSettings:{
            types : {
                access:'accessToken',
                refresh:'refreshToken'
            },
            refreshToken:{
                maxValidTimeInSeconds:3600*24,
                maxUsage:1
            },
            accessToken:{
                maxValidTimeInSeconds:3600,
                maxUsage:1
            }
        }
    };
}();
