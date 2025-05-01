# Shared ChatGPT Platform
#https://llamacoder.together.ai/chats/ak7wWybYW2ED2Za2

A GitHub Pages-hosted application that allows multiple users to share a single ChatGPT API key through a backend proxy.

## Features

- Multi-user chat interface
- Shared API key through backend proxy
- User identification
- Responsive design for all devices
- Loading indicators
- Error handling

## Setup Instructions

1. **Frontend Deployment**:
   - Clone this repository
   - Update the `PROXY_URL` in `app.js` with your backend URL
   - Push to GitHub (repository must be named `[username].github.io`)

2. **Backend Setup**:
   - Deploy a proxy server (Vercel/Netlify/Firebase)
   - Set your OpenAI API key as an environment variable
   - Implement rate limiting

3. **Access**:
   - Your site will be live at: `https://L0V3Y0UT00.github.io`

## Backend Requirements

Your proxy server should:
- Protect your OpenAI API key
- Implement rate limiting
- Handle CORS properly
- Process requests from the frontend

Example proxy code is available in the repository.
