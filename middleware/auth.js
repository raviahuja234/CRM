const jwt = require('jsonwebtoken');
const config = require('../configs/auth.configs');
const User = require('../models/user.model');

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if(!token){
        return res.status(403).send({
            message: "No token Provided."
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
            return res.status(401).send({
                message: "Unauthorized"
            });
        }

        req.userId = decoded.id;
        next();
    })
}

isAdmin = async (req, res, next) => {
    const user = await User.findOne({
        userId: req.userId
    });

    if(user && user.userType == "ADMIN"){
        next();
    }else{
        return res.status(401).send({
            message: "Require admin role to access this feature."
        });
    }
}

const authCheck = {
    verifyToken : verifyToken,
    isAdmin : isAdmin
}

module.exports = authCheck;
