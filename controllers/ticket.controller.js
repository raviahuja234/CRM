const Ticket = require('../models/ticket.model');
const userModel = require('../models/user.model');
const objectConvertor = require('../utils/objectConvertor');

exports.createTicket = async (req, res) => {

    const ticketObj = {
        title: req.body.title,
        description: req.body.description,
        ticketPriority: req.body.ticketPriority,
        status: req.body.status, 
        reporter: req.userId
    }

    try{

        const engineer = await userModel.findOne({
            userType: 'ENGINEER',
            userStatus: 'APPROVED'
        });

        ticketObj.assignee = engineer.userId;
        const ticket = await Ticket.create(ticketObj);
        console.log('ticket<><>'+ticket);

        if(ticket){

            const user = userModel.findOne({
                userId: req.userId
            });

            user.ticketsCreated.push(ticket._id);
            await user.save();
            console.log('user<><>'+user);
            engineer.ticketAssigned.push(ticket._id);
            await engineer.save(); 
            console.log('engineer<><>'+engineer);
        }
        res.status(200).send(objectConvertor.ticketResponse(ticket));
    }catch(err){
        console.log('Error while ticket Creation '+err);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
}