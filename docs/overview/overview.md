# Project Overview

The Postman Runner File Processor converts Postman Runner `.txt` files into structured JSON. The application runs entirely in the browser using React and TypeScript.

## Key Features

- Drag-and-drop file upload with progress feedback
- Parses each file to extract:
  - remaining files count
  - télédémarche number
  - project name
  - dossier number
  - deposit date
- Downloads a JSON file for every processed input
- Displays processing statistics and errors
- Client-side validation for file type, size and rate limits
- [Security configuration reference](../reference/security-config.md) describes these limits in detail
