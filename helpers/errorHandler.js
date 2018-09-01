const config =  require('../config');

exports.errorResponseHandler = function (error, res) {

    switch (error.name) {
        case 'ValidationError':
            return res.status(422).json({message:error.message});
        case 'CastError':
            return res.status(422).json({message:error.message});
        case 'DocumentNotFoundError':
            return res.status(404).json({message:error.message});
        case 'matiError':
            return res.status(error.status).json({
                message:(config.modes.development === config.environment)? stack : undefined
            });
        default:
            return res.status(500).json({message:error.message});
    }
};

function matiError (msg, name, status, stack) {
    this.message = msg;
    this.name = name || 'matiError';
    this.status = status || 500;
    this.stack = (config.modes.development === config.environment)?stack : undefined;
    Error.call(this, msg);

}
matiError.prototype.__proto__ = Error.prototype;
exports.matiError = matiError;
