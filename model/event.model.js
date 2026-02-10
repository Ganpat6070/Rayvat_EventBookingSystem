const db = require('../config/db');
const moment = require('moment');

module.exports = {
    createEvent: async (data, user) => {
        const eventObj = {
            name: data.name,
            description: data.description || null,
            date: data.date,
            capacity: data.capacity,
            availableseats: data.capacity,  // Initially equals capacity (no bookings yet)
            status: 1, // 1=Upcoming, 2=Completed, 3=Cancelled
            createdby: user.userid,
            createddate: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        const result = await db.insert('eventmaster', eventObj);
        if (!result.insertId) return { success: 0, status: 500, msg: 'Failed to create event' };
        return { success: 1, status: 201, msg: 'Event created successfully', data: { eventid: result.insertId } };
    },

    getEvents: async (filters) => {
        let sql = 'SELECT * FROM eventmaster WHERE isdeleted = 0';
        const params = [];

        if (filters.start) {
            sql += ' AND date >= ?';
            params.push(filters.start);
        }
        if (filters.end) {
            sql += ' AND date <= ?';
            params.push(filters.end);
        }

        sql += ' ORDER BY date ASC';

        // Get total count before applying LIMIT for pagination metadata
        const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
        const countResult = await db.getResults(countSql, params);
        const total = countResult.length ? countResult[0].total : 0;

        // Apply pagination
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 10;
        const offset = (page - 1) * limit;

        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const events = await db.getResults(sql, params);
        return {
            success: 1,
            status: 200,
            msg: 'Events fetched successfully',
            data: events,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },

    getEventById: async (eventid) => {
        const events = await db.getResults(
            'SELECT * FROM eventmaster WHERE eventid = ? AND isdeleted = 0',
            [eventid]
        );
        if (!events.length) return { success: 0, status: 404, msg: 'Event not found' };
        return { success: 1, status: 200, msg: 'Event fetched successfully', data: events[0] };
    },

    updateEvent: async (eventid, data) => {
        const eventResult = await db.getResults(
            'SELECT * FROM eventmaster WHERE eventid = ? AND isdeleted = 0',
            [eventid]
        );
        if (!eventResult.length) return { success: 0, status: 404, msg: 'Event not found' };
        const event = eventResult[0];

        const updateObj = {
            modifieddate: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        if (data.name) updateObj.name = data.name;
        if (data.description !== undefined) updateObj.description = data.description;
        if (data.date) updateObj.date = data.date;
        if (data.status) updateObj.status = data.status;

        // Recalculate availableseats when capacity changes (prevent reducing below already booked seats)
        if (data.capacity) {
            const bookedSeats = event.capacity - event.availableseats;
            if (data.capacity < bookedSeats)
                return { success: 0, status: 400, msg: `Cannot reduce capacity below ${bookedSeats} (already booked)` };
            updateObj.capacity = data.capacity;
            updateObj.availableseats = data.capacity - bookedSeats;
        }

        const result = await db.update('eventmaster', updateObj, { eventid });
        if (!result.affectedRows) return { success: 0, status: 500, msg: 'Failed to update event' };
        return { success: 1, status: 200, msg: 'Event updated successfully' };
    },

    // Soft delete - sets isdeleted flag instead of removing the record
    deleteEvent: async (eventid) => {
        const eventResult = await db.getResults(
            'SELECT * FROM eventmaster WHERE eventid = ? AND isdeleted = 0',
            [eventid]
        );
        if (!eventResult.length) return { success: 0, status: 404, msg: 'Event not found' };

        const updateObj = {
            isdeleted: 1,
            modifieddate: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        const result = await db.update('eventmaster', updateObj, { eventid });
        if (!result.affectedRows) return { success: 0, status: 500, msg: 'Failed to delete event' };
        return { success: 1, status: 200, msg: 'Event deleted successfully' };
    },
};
