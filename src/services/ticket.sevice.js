import { v4 as uuidv4 } from 'uuid';
import TicketRepository from '../repositories/ticket.repository.js';

class TicketService {
  async generateTicket(ticketData) {
    try {
      // Agregar el código al objeto de datos del ticket
      const ticketCode = uuidv4();
      const ticketDataWithCode = { ...ticketData, code: ticketCode };

      // Crear el ticket utilizando el repositorio
      const newTicket = await TicketRepository.createTicket(ticketDataWithCode);

      return newTicket;
    } catch (error) {
      throw error;
    }
  }

  async getTicketByCode(ticketCode) {
    try {
      return await TicketRepository.getTicketByCode(ticketCode);
    } catch (error) {
      throw error;
    }
  }
}

export default new TicketService();
