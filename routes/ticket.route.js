const ticketController = require('../controllers/ticket.controller');
const authMiddleware = require('../middleware/auth');
const ticketMiddleware = require('../middleware/verifyTicketRequestBody');

module.exports = function(app){
    app.post("/crm/api/v1/ticket", [authMiddleware.verifyToken, ticketMiddleware.validateTicketReq], 
                                    ticketController.createTicket);

    app.put("/crm/api/v1/ticket/:id", [authMiddleware.verifyToken, ticketMiddleware.validateTicketReq], 
                                    ticketController.updateTicket);

    app.put("/crm/api/v1/tickets", [authMiddleware.verifyToken], 
                                    ticketController.getAllTickets);                                
}