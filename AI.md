# AI Workflow Documentation

## Overview

During the development of this project, AI assistance was used as a development support tool for architecture decisions, debugging, code review, and documentation.

The AI was used as a pair-programming assistant. All generated suggestions were reviewed, adapted, and tested before being implemented into the project.

---

## Tools Used

- ChatGPT (GPT-5) — used for:
  - architecture discussions;
  - debugging React and TypeScript issues;
  - API design suggestions;
  - code improvements;
  - documentation writing.

- Visual Studio Code — used as the main development environment.

- Git — used for version control.

---

## How AI Was Used

AI assistance was used during different stages of development:

### 1. Project Architecture

AI was used to discuss the overall application structure:

- React + TypeScript frontend;
- Express + TypeScript backend;
- REST API communication;
- separation between UI logic and business logic.

Example prompt:

```
How should I structure a React + Express application for a cabana booking system where the frontend only consumes REST API data?
```

---

### 2. Backend Development

AI was used to help design:

- map parsing logic;
- converting ASCII map files into JSON objects;
- guest validation flow;
- booking API endpoints;
- CLI argument handling.

Example prompts:

```
How can I pass --map and --bookings arguments from npm start to a TypeScript backend?
```

```
How should the backend validate room number and guest name before booking a cabana?
```

---

### 3. Frontend Development

AI was used for:

- React state management;
- rendering dynamic map tiles;
- updating UI after successful booking;
- improving component structure;
- debugging TypeScript errors.

Example prompts:

```
How can React update the map immediately after a successful booking request?
```

```
How should I render different images depending on the tile type?
```

---

### 4. Debugging

AI was used to investigate and fix development issues, including:

- React rendering problems;
- TypeScript type errors;
- incorrect imports;
- Vite configuration issues;
- Node.js module problems.

Example prompts:

```
Why does React show "Too many re-renders" in this component?
```

```
Why is my TypeScript import not working with Express?
```

---

## Development Workflow

The general workflow was:

1. Implement a feature manually.
2. Run the application and test the behaviour.
3. Use AI assistance to investigate errors or improve the implementation.
4. Review suggested solutions.
5. Apply only the changes that fit the project requirements.
6. Test the updated functionality.

---

## Example AI-assisted Decisions

### Backend as the source of truth

The application was structured so that the backend owns the map and booking state.

Reason:

- The frontend should not know about the original ASCII format.
- The API provides a consistent data format for rendering.
- Business rules such as guest validation stay on the server.

---

### In-memory booking storage

Persistent storage was intentionally skipped.

Reason:

- The task explicitly allows in-memory/session state.
- A database would add unnecessary complexity.
- The focus was on API design and user interaction.

---

### Simple authentication approach

No authentication system was implemented.

Reason:

- The task specifies that knowing the room number and guest name is sufficient verification.
- Implementing sessions or accounts would go beyond the requirements.

---

## Number of AI Interaction Steps

AI assistance was used throughout the development process in multiple iterations:

- initial architecture planning;
- backend API design;
- frontend implementation;
- debugging;
- refactoring;
- documentation preparation.

The exact number of prompts varied as development progressed, with AI being used continuously as a programming assistant rather than for generating the entire application at once.
