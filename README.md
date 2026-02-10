# Event Booking System

Node.js backend API for managing events and bookings. Users can register, create events, and book seats.

# Tech Stack

Express, MySQL, JWT auth, bcrypt, Winston logging, rate limiting.

# Setup

1. `npm install`
2. run `migration.sql`
3. change `.env` (I have added to github)
4. `npm start` (uses nodemon, runs on port 8000)

# Env Variables
Check from .env file

# API Routes

`/api/auth` - Register, login 
`/api/events` - CRUD for events 
`/api/bookings` - Create/cancel bookings 

All routes under `/api`. Postman collection included for testing (Event_Booking_System.postman_collection.json).

# Roles
  1/2 are roleid
- Admin (1): Create and manage events
- User (2): Book seats for events

`logs/` will place into this folder.
