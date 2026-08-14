# Resort Cabana Booking

A full-stack web application for browsing an interactive resort map and booking poolside cabanas.

The application allows guests to view cabana availability on a visual resort map, select available cabanas, verify their identity using room number and guest name, and complete a booking. After a successful booking, the map updates immediately and the cabana is displayed as unavailable.

## Features

- Interactive resort map rendered from an ASCII map file
- REST API driven frontend
- Real-time cabana availability updates
- Cabana booking flow
- Guest validation using room number and guest name
- Immediate UI update after successful booking
- Human-readable validation and booking errors
- Configurable map and guest data files through CLI arguments

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Material UI

### Backend

- Node.js
- Express
- TypeScript

## Project Structure

```
.
├── server/              # Express backend
│   ├── server.ts        # API entry point
│   ├── map.ts           # ASCII map parser
│   ├── guests.ts        # Guest data loader
│   └── config.ts        # CLI argument configuration
│
├── src/                 # React frontend
│   ├── App.tsx
│   └── components/
│
├── data/
│   ├── map.ascii
│   └── bookings.json
│
└── package.json
```

## Installation

Install dependencies:

```bash
npm install
```

## Running the Application

Start both backend and frontend:

```bash
npm run start
```

The application will start:

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:3000
```

## Custom Map and Booking Files

The application supports custom input files through command line arguments:

```bash
npm run start -- --map path/to/map.ascii --bookings path/to/bookings.json
```

Example:

```bash
npm run start -- --map data/custom-map.ascii --bookings data/custom-bookings.json
```

The backend reads these files on startup and uses them as the source of truth for the resort layout and guest validation.

## API

### GET `/api/map`

Returns the current resort map with cabana availability information.

Example response:

```json
{
  "rows": [
    [
      {
        "id": 1,
        "x": 3,
        "y": 10,
        "type": "cabana",
        "available": true
      }
    ]
  ]
}
```

---

### POST `/api/book`

Creates a cabana booking.

Request:

```json
{
  "cabanaId": 5,
  "room": "102",
  "guestName": "Bob Jones"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Cabana booked"
}
```

Example error response:

```json
{
  "success": false,
  "message": "Invalid room number or guest name"
}
```

## Design Decisions

The application follows a simple client-server architecture where the backend is responsible for all business logic and acts as the single source of truth. The frontend only displays data received from the REST API and sends booking requests.

The ASCII resort map is parsed by the backend into structured JSON objects. This keeps the frontend independent from the original map format and allows the same UI to work with different map files.

Cabana bookings are stored in memory because persistent storage was not required by the assignment. A database, authentication system, and advanced concurrency handling were intentionally skipped to keep the implementation focused on the required functionality.

## Booking Flow

1. Guest selects an available cabana on the map.
2. Booking form appears.
3. Guest enters:
   - Room number
   - Full name
4. Backend validates the guest information.
5. If validation succeeds:
   - Cabana is marked as unavailable.
   - Map is refreshed.
   - Confirmation message is displayed.
6. If validation fails:
   - User receives a short error message.

## Testing

Run all automated tests:

```bash
npm test
```

Backend tests:

```bash
npm run test:server
```

Frontend tests:

```bash
npm run test:client
```

The tests cover:

- Map API responses
- Booking validation
- Successful and failed bookings
- Cabana availability updates
- Frontend booking interactions

## Limitations

- Booking data is stored only in memory and resets after backend restart.
- No authentication system is implemented.
- The application assumes room number and guest name are sufficient identity verification.
