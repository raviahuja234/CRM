const ticketController = require('../controllers/ticket.controller');
const authMiddleware = require('../middleware/auth');
const ticketMiddleware = require('../middleware/verifyTicketRequestBody');

module.exports = function(app){
    app.post("/crm/api/v1/ticket", [authMiddleware.verifyToken, ticketMiddleware.validateTicketReq], 
                                    ticketController.createTicket);
}