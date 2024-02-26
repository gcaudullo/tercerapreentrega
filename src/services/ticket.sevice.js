// ticket.services.js
import { v4 as uuidv4 } from 'uuid';
import TicketDAO from '../dao/ticket.dao.js';

class TicketService {
    async generateTicket(ticketData) {
        try {
            // Agregar el código al objeto de datos del ticket
            const ticketCode = uuidv4();
            const ticketDataWithCode = { ...ticketData, code: ticketCode };

            // Crear el ticket en la base de datos
            const newTicket = await TicketDAO.createTicket(ticketDataWithCode);

            return newTicket;
        } catch (error) {
            throw error;
        }
    }

    async getTicketByCode(ticketCode) {
        try {
            return await TicketDAO.getTicketByCode(ticketCode);
        } catch (error) {
            throw error;
        }
    }
}

export default new TicketService();
