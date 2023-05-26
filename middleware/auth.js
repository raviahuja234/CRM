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

checkUserType = async (req, res, next) => {
    const loggedInUser = await User.findOne({
        userId: req.userid
    });

    if(loggedInUser && loggedInUser.userType == "ADMIN"){
        next();
    }else if(loggedInUser.userType == "ENGINEER" || loggedInUser.userType == "CUSTOMER"){
        if(loggedInUser.userId == req.params.id){
            next();
        }else{
            return res.status(401).send({
                message: "You are not the owner."
            });
        }
    }else{
        return res.status(401).send({
            message: "Require admin role to access this feature."
        });
    }
}

const authCheck = {
    verifyToken : verifyToken,
    isAdmin : isAdmin,
    checkUserType : checkUserType
}

module.exports = authCheck;
