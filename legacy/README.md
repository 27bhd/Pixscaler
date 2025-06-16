# 📁 Legacy Server Files

This folder contains the original server-side implementation of Pixscaler that was used before converting to a client-side application.

## Files Included
- `server.js` - Express.js server with image processing endpoints
- `config.js` - Server configuration and CORS settings
- `routes/` - Express route handlers for authentication
- `middleware/` - Authentication and rate limiting middleware
- `database/` - Database initialization scripts

## Why These Files Are Here
Pixscaler was originally built as a Node.js/Express server-side application but was converted to a pure client-side application for:
- **Better Privacy** - Images never leave the user's device
- **Improved Performance** - No server round trips
- **Reduced Costs** - No server processing required
- **Enhanced Security** - No server vulnerabilities

## Current Architecture
The current Pixscaler application is:
- **100% Client-Side** - All processing happens in the browser
- **Static Files Only** - Served via Railway's static hosting
- **Canvas API** - Uses HTML5 Canvas for image processing
- **No Backend** - No server, database, or API endpoints

## Keeping These Files
These files are preserved for:
- **Reference** - Understanding the original architecture
- **Rollback** - If server-side processing is ever needed again
- **Learning** - Comparing client-side vs server-side approaches

## Do Not Deploy
These files are not used in the current deployment and should not be included in production builds. 