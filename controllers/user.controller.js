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