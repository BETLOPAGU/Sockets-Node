const TicketControl = require('../models/ticket-control')

const ticketcontrol = new TicketControl();


const socketController = (socket) => {

    //Cuando un cliente se conecta
    socket.emit('ultimo-ticket', ticketcontrol.ultimo);
    socket.emit('estado-actual', ticketcontrol.ultimos4);
    // 'tickets-pendientes', ticketcontrol.tickets.length
    socket.emit('tickets-pendientes', ticketcontrol.tickets.length);


    socket.on('siguiente-ticket', (payload, callback) => {

        const siguiente = ticketcontrol.siguiente();
        callback(siguiente);

        //TODO Notificar que hay un  nuevo ticket pendiente de asignar
        socket.broadcast.emit('tickets-pendientes', ticketcontrol.tickets.length);

    })

    socket.on('atender-ticket', ({ escritorio }, callback) => {

        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketcontrol.atenderTicket(escritorio);

        //Notificar cambio en los últimos 4
        socket.broadcast.emit('estado-actual', ticketcontrol.ultimos4);

        socket.emit('tickets-pendientes', ticketcontrol.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketcontrol.tickets.length);

        if (!ticket) {
            callback({
                ok: false,
                msg: 'Ya no hay tickes pendientes'
            })
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    });
}



module.exports = {
    socketController
}

