const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretConfig = require('../configs/auth.configs');

/*sign up api */
exports.signup = async (req, res) => {
    var userTypeReq = req.body.userType;
    var userStatusReq = "APPROVED";
    if (userTypeReq && userTypeReq === 'ENGINEER') {
        userStatusReq = "PENDING";
    }
    const {name, userId, email, password, userType, userStatus, phoneNumber} = req.body;
    const userObj = {
        name,
        userId,
        email,
        password,
        userType,
        userStatus,
        phoneNumber
    }
    console.log(name);
    console.log(userId);
    console.log(email);
    console.log(password);
    console.log(userType);
    console.log(userStatus);

    try {
        const user = await User.create(userObj);
        res.status(200).send({
            name: user.name,
            userId: user.userId,
            email: user.email,
            password: bcrypt.hashSync(user.password, 10),
            userType: user.userTypeReq,
            userStatus: user.userStatusReq
        });
    } catch (err) {
        console.log('Error : ' + err.message);
        res.status(500).send({
            message: "Internal server error."
        });
    }
}

exports.signin = async (req, res) => {
    const user = await User.findOne({ userId: req.body.userId });

    if (user == null) {
        return res.status(400).send({
            message: "UserId does'nt exist"
        });
    }

    if (user.userStatus != "APPROVED") {
        return res.status(200).send({
            message: `Cant login with user status as ${user.userStatus}.`
        });
    }
    console.log('user.password<><'+user.password);
    console.log('req.body.password<><'+req.body.password);
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(200).send({
            message: "Invalid password"
        });
    }

    /*Create a token and send to user*/

    var token = jwt.sign({ id: user.userId }, secretConfig.secret, { expiresIn: 5000 });
    console.log(token);

    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userTypeReq,
        userStatus: user.userStatusReq,
        accessToken: token
    })
}