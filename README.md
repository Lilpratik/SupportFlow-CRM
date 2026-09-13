# SupportFlow CRM

A full-stack customer support CRM built for the Datastraw Full Stack AI Developer Intern assessment.

## Live Application

https://support-flow-crm-orpin.vercel.app/

## Backend API

https://supportflow-crm-o8hu.onrender.com

## Tech Stack

- React
- Vite
- Tailwind CSS
- Node.js
- Express
- Supabase
- PostgreSQL
- REST API

## Features

- Create support tickets
- Auto-generated ticket IDs
- Ticket listing
- Search by ticket ID, customer name, email and description
- Filter by ticket status
- Ticket detail view
- Update ticket status
- Add internal notes
- Responsive interface
- Production deployment

## Architecture

React frontend communicates with the Express REST API.

The Express backend communicates with Supabase PostgreSQL.

```text
React
  ↓
Express REST API
  ↓
Supabase
  ↓
PostgreSQL



API Endpoints
Create ticket

POST /api/tickets

List tickets

GET /api/tickets

Search/filter

GET /api/tickets?search=...&status=...

Get ticket

GET /api/tickets/:ticket_id

Update ticket

PUT /api/tickets/:ticket_id

Local Development
Backend
cd server
npm install
npm run dev
Frontend
cd client
npm install
npm run dev

Create the required environment variables using .env.example.


Future Improvements
AI-assisted ticket summarization and classification
Automated workflows using webhooks and n8n
Authentication and role-based access
Pagination for large ticket volumes
