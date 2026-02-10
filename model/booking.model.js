const db = require('../config/db');
const moment = require('moment');

module.exports = {
    createBooking: async (data, user) => {
        const eventResult = await db.getResults(
            'SELECT * FROM eventmaster WHERE eventid = ? AND isdeleted = 0',
            [data.eventid]
        );
        if (!eventResult.length) return { success: 0, status: 404, msg: 'Event not found' };
        
        const event = eventResult[0];
        if (!event.status) return { success: 0, status: 400, msg: 'Event is not available for booking' }; // Only upcoming events (status=1) can be booked

        // Real-time seat availability check
        const seats = data.seats || 1;
        if (event.availableseats < seats)
            return { success: 0, status: 400, msg: `Only ${event.availableseats} seats available` };

        // Prevent duplicate booking - one active booking per user per event
        const existingBookings = await db.getResults(
            'SELECT bookingid FROM bookingmaster WHERE eventid = ? AND userid = ? AND status = 1 AND isdeleted = 0',
            [data.eventid, user.userid]
        );
        if (existingBookings.length) return { success: 0, status: 409, msg: 'You already have a booking for this event' };

        const bookingObj = {
            eventid: data.eventid,
            userid: user.userid,
            seats,
            status: 1, // 1=Confirmed, 2=Cancelled
            createddate: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        const result = await db.insert('bookingmaster', bookingObj);
        if (!result.insertId) return { success: 0, status: 500, msg: 'Failed to create booking' };

        // Deduct booked seats from events availableseats
        await db.update(
            'eventmaster',
            { availableseats: event.availableseats - seats },
            { eventid: data.eventid }
        );

        return { success: 1, status: 201, msg: 'Booking confirmed successfully', data: { bookingid: result.insertId } };
    },

    // Only the booking owner can cancel their own booking
    cancelBooking: async (bookingid, user) => {
        const bookingResult = await db.getResults(
            'SELECT * FROM bookingmaster WHERE bookingid = ? AND userid = ? AND status = 1 AND isdeleted = 0',
            [bookingid, user.userid]
        );
        if (!bookingResult.length) return { success: 0, status: 404, msg: 'Booking not found' };
        const booking = bookingResult[0];

        await db.update('bookingmaster', {
            status: 2, // Mark as cancelled
            modifieddate: moment().format('YYYY-MM-DD HH:mm:ss'),
        }, { bookingid });

        // Restore cancelled seats back to events availableseats
        const eventResult = await db.getResults(
            'SELECT availableseats FROM eventmaster WHERE eventid = ?',
            [booking.eventid]
        );
        if (eventResult.length) {
            const event = eventResult[0];
            await db.update(
                'eventmaster',
                { availableseats: event.availableseats + booking.seats },
                { eventid: booking.eventid }
            );
        }

        return { success: 1, status: 200, msg: 'Booking cancelled successfully' };
    },

    getMyBookings: async (user) => {
        const sql = `SELECT b.bookingid, b.seats, b.status as bookingstatus, b.createddate as bookingdate,
                     e.eventid, e.name as eventname, e.date as eventdate, e.capacity, e.availableseats
                     FROM bookingmaster b
                     JOIN eventmaster e ON b.eventid = e.eventid AND e.isdeleted=0
                     WHERE b.userid = ? AND b.isdeleted = 0
                     ORDER BY b.createddate DESC`;
        const bookings = await db.getResults(sql, [user.userid]);
        return { success: 1, status: 200, msg: 'Bookings fetched successfully', data: bookings };
    },
};
