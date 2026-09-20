# Project LOOP

## AI Customer Feedback Intelligence Platform

Project LOOP is a full-stack customer feedback intelligence platform that helps teams collect, analyze, and understand customer feedback.

It automatically identifies sentiment and themes, highlights recurring issues, provides feedback-based insights through Ask LOOP, and generates Voice-of-Customer reports.

## Live Demo

https://project-loop-swart.vercel.app

## Features

- JWT authentication
- Multi-tenant workspace foundation
- Manual feedback collection
- CSV feedback import
- Automatic sentiment analysis
- Automatic theme classification
- Analytics dashboard
- Ask LOOP feedback assistant
- Voice-of-Customer PDF reports
- Team management
- Basic role-based access control
- Responsive SaaS interface

## Tech Stack

### Frontend
- React
- Vite
- Axios
- Recharts
- jsPDF
- Lucide React

### Backend
- Python
- FastAPI
- SQLAlchemy
- JWT
- bcrypt
- SQLite

### Deployment
- Vercel - Frontend
- Render - Backend

## Architecture

User
↓
React / Vite Frontend
↓
FastAPI REST API
↓
Authentication + Workspace Layer
↓
Feedback Analysis Services
↓
SQLite Database

## Feedback Intelligence

When feedback is submitted, LOOP automatically:

1. Stores the feedback in the user's workspace.
2. Analyzes customer sentiment.
3. Detects the feedback theme.
4. Updates dashboard analytics.
5. Makes the feedback available to Ask LOOP.
6. Includes it in Voice-of-Customer reporting.

## Ask LOOP

Ask LOOP allows users to ask questions about their customer feedback, including:

- What are the main negative issues?
- What is the top feedback theme?
- How much positive feedback do we have?

The backend supports optional LLM integration and includes deterministic fallback analysis.

## Workspace & Roles

Supported roles include:

- Admin
- Product Manager
- Support Agent
- Viewer

The current version provides a basic RBAC foundation with administrator-controlled member addition.

## API Documentation

https://project-loop-kqsr.onrender.com/docs

## Backend

https://project-loop-kqsr.onrender.com

## Current Limitations

- Production currently uses SQLite.
- Full fine-grained RBAC is future work.
- Full multi-workspace switching is not yet implemented.
- External LLM functionality depends on API availability; fallback analysis remains available.

## Future Improvements

- PostgreSQL production database
- Complete RBAC permissions
- Email workspace invitations
- RAG and semantic feedback search
- Automated feedback integrations
- Alerts and scheduled reports
- Automated testing and CI/CD

## Author

Developed as a full-stack AI customer feedback intelligence project.