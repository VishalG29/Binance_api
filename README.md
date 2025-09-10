# Binance Futures API Server

A Node.js server for accessing Binance Futures API with Singapore server deployment support.

## Features

- ✅ Account balance retrieval
- ✅ Futures positions monitoring  
- ✅ Real-time ticker prices
- ✅ Candlestick (kline) data
- ✅ Read-only API permissions
- ✅ Singapore server deployment

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | API information |
| `GET /account` | Account balance and info |
| `GET /positions` | Active futures positions |
| `GET /ticker/:symbol` | 24hr ticker (e.g., `/ticker/BTCUSDT`) |
| `GET /klines/:symbol` | Candlestick data |

## Local Development

```bash
npm install
cp .env.example .env
# Add your Binance API keys to .env
npm start
```

## Render Deployment

1. Push to GitHub
2. Connect to Render
3. Deploy with Singapore region
4. Add environment variables:
   - `BINANCE_API_KEY`
   - `BINANCE_API_SECRET`

## Environment Variables

```env
BINANCE_API_KEY=your_api_key
BINANCE_API_SECRET=your_api_secret
PORT=3000
```

**Important**: Use read-only API keys for security.