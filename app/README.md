# Listing Scrapers

A TypeScript-based web scraping system that collects job listings from various casting and production websites and integrates them with our backend database.

## Features

- Automated scraping of job listings from multiple sources
- Intelligent data extraction using LLM (Large Language Model)
- Duplicate detection to prevent redundant entries
- Integration with CD (Casting Director) user database
- Graceful error handling and process management
- Logging system for monitoring and debugging

## Prerequisites

- Node.js (v20 or higher)
- TypeScript
- MySQL/MatiaDB database
- Environment variables (see Configuration section)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd listing-scrapers
```

2. Install dependencies:
```bash
npm install
```


## Configuration

The project requires the following environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_API_KEY`: API key for Google's LLM service

## Project Structure

```
app/
├── src/
│   ├── app/              # Main application code
│   ├── config/           # Configuration files
│   ├── helpers/          # Utility functions
│   └── types/            # TypeScript type definitions
├── logs/                 # Application logs
└── dist/                # Compiled JavaScript files
```

## Usage

1. Build the project:
```bash
npm run build
```

2. Run the scraper:
```bash
npm start
```

## Supported Websites

Currently supports scraping from:
- Project Casting (projectcasting.com)

## Database Integration

The scraper integrates with the following database tables:
- `cd_user`: Stores casting director information
- `castings`: Stores scraped job listings

## Error Handling

The system includes comprehensive error handling:
- Graceful process termination (SIGINT, SIGTERM)
- Automatic browser cleanup
- Error logging to `logs/app.log`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Your License Here]

## Support

For support, please contact [Your Contact Information] 