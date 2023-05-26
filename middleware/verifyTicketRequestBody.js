verifyTicketRequestBody = (req, res, next) => {
    if(!req.body.title){
        return res.status(400).send({
            message: "Title is necessary"
        });
    }

    if(!req.body.description){
        return res.status(400).send({
            message: "Description is necessary"
        });
    }

    next();
}

const verifyReq = {
    validateTicketReq : verifyTicketRequestBody
}

module.exports = verifyReq;