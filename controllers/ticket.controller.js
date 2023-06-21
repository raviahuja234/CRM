const Ticket = require('../models/ticket.model');
const userModel = require('../models/user.model');
const objectConvertor = require('../utils/objectConvertor');
const CONSTANTS = require('../utils/constants');

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

exports.updateTicket = async (req, res) => {
    const ticketId = req.params.id;
    const ticket = await Ticket.findOne({_id:ticketId});
    if(!ticket){
        return res.status(400).send({
            message:`ticket with Id ${ticketId} is not present`
        });
    }
    const savedUser = await userModel.findOne({userId: req.userId});

    if(ticket.reporter == req.userId || ticket.assignee == req.userId ||
        savedUser.userType == CONSTANTS.userTypes.admin){
            ticket.title = req.body.title != 
                        undefined ? req.body.title: ticket.title;
            ticket.description = req.body.description != 
                        undefined ? req.body.description: ticket.description;
            ticket.ticketPriority = req.body.ticketPriority != 
                        undefined ? req.body.ticketPriority: ticket.ticketPriority;
            ticket.status = req.body.status != 
                        undefined ? req.body.status: ticket.status;
            ticket.assignee = req.body.assignee != 
                        undefined ? req.body.assignee: ticket.assignee;

        var updatedTicket = await ticket.save();
        res.status(200).send(objectConvertor.ticketResponse(updatedTicket));
    }else{
        res.status(401).send({
            message: "Ticket can be updated by an ENGINEER or A CUSTOMER and an ADMIN"
        });
    }
}

exports.getAllTickets = async (req, res) => {
    /**
     * ADMIN should get all tickets+ can apply status filters
     * customer should only get tickets created by them
     * engineer should get tikets created or assigned to them
     */

    const queryObj = {}
    if(req.query.status != undefined){
        queryObj.status = {$regex: new RegExp(req.query.status), $options: "1"};
    }
    const savedUser = await userModel.findOne({userId: req.userId});

    if(savedUser.userType == CONSTANTS.userTypes.engineer){
        queryObj.assignee = req.userId;
    }else if(savedUser.userType == CONSTANTS.userTypes.customer){
        queryObj.reporter = req.userId;
    }else{
        //ADMIN
    }

    const tickets = await Ticket.find(queryObj);

    res.status(200).send(tickets);
}