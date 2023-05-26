const userModel = require('../models/user.model');
const objectConvertor = require('../utils/objectConvertor');

/*** fetch list of all users */
exports.findAll = async (req, res) => {
    try{

        let userQuery = {};
        let userTypeReq = req.query.userType;
        let userStatusReq = req.query.userStatus; 

        if(userTypeReq){
            userQuery.userType = userTypeReq;
        }
        if(userStatusReq){
            userQuery.userStatus = userStatusReq;
        }

        const users = await  userModel.find(userQuery);
        res.status(200).send(objectConvertor.userResponse(users));
    }catch(err){
        console.log(`Error is : ${err}`);
        res.status(500).send({
            message:"Internal server Error"
        });
    }
}

exports.findById = async (req,res) => {
    const reqUserId = req.params.id;
    try{
        const user = await userModel.findOne({userId : reqUserId});
        console.log('user><><'+user);
        if(!user){
            return res.status(200).send(`user with Id ${reqUserId} is not present`);
        }
        const {name, userId, email, userType, userStatus} = user;
        var userResObj = {name, userId, email, userType, userStatus}
        return res.status(200).send(userResObj);
    } catch(err){
        res.status(500).send({
            message:"Internal server error"
        });
    }
}

exports.update1 = async (req,res) => {
    const reqUserId = req.params.id;
    try{
        const user = await userModel.findOne({userId : reqUserId});
        console.log('user><><'+user);
        if(!user){
            return res.status(200).send(`user with Id ${reqUserId} is not present`);
        }

        user.name = req.body.name ? req.body.name : user.name;
        user.userStatus = req.body.userStatus ? req.body.userStatus : user.userStatus;
        user.userType = req.body.userType ? req.body.userType : user.userType;

        const newUser = await user.save();

        var userResObj = {
            name: newUser.name, 
            userId: newUser.userId, 
            email: newUser.email, 
            userType: newUser.userType, 
            userStatus: newUser.userStatus}
        return res.status(200).send(userResObj);
    } catch(err){
        res.status(500).send({
            message:"Internal server error"
        });
    }
}