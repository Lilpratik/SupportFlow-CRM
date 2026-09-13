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

## AI Ticket Intelligence

SupportFlow includes an optional AI analysis workflow for existing
tickets.

The AI analyzes a ticket and returns:

- Summary
- Priority
- Category

The AI layer does not participate in the core ticket creation workflow.

This keeps ticket creation and CRM operations available even when the
AI provider is unavailable.

A deterministic fallback is used when the AI provider cannot respond.




## n8n Automation

After a ticket is successfully created, the backend can send the
ticket payload to an n8n webhook.

The workflow receives the ticket, normalizes the data and branches
based on the ticket content.

This demonstrates webhook-based downstream automation while keeping
PostgreSQL as the source of truth.


## Architectural Decisions

### PostgreSQL as the source of truth

Ticket and note persistence is handled by Supabase PostgreSQL.

### REST API boundary

The React frontend communicates with the Express backend rather
than directly using privileged database credentials.

### AI as an enhancement

AI analysis is independent of core CRM functionality.

### Fallback behavior

A deterministic fallback classification is used when the AI provider
is unavailable.

### Simple schema

The database uses tickets and notes rather than introducing
unnecessary tables for the assignment MVP.


## Challenges

### AI provider availability

During development, the first AI provider returned an insufficient
quota response. The AI integration was moved behind a provider
boundary and a deterministic fallback was added so the CRM would
remain functional independently of AI availability.

### Temporary provider unavailability

The Gemini service returned a temporary 503 response during testing.
Retry handling was added for temporary provider failures.

### Deployment configuration

The frontend and backend use separate environment variables so the
same codebase can run locally and in production without hardcoded
production URLs or credentials.


## Future Improvements

- Authentication and role-based access
- Pagination for large ticket volumes
- Server-side sorting
- More granular ticket categories
- Persistent AI analysis history
- Asynchronous job processing for automation
- Email/customer notification workflows
- Agent assignment and team queues
- Analytics and support KPIs
