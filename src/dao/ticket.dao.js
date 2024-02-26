// ticket.dao.js
import TicketModel from './models/ticket.model.js';

export default class TicketDAO {
    static async createTicket(ticketData) {
        try {
            const newTicket = await TicketModel.create(ticketData);
            return newTicket;
        } catch (error) {
            throw error;
        }
    }

    static async getTicketByCode(ticketCode) {
        try {
            return await TicketModel.findOne({ code: ticketCode });
        } catch (error) {
            throw error;
        }
    }
}
