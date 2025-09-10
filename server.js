const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const BINANCE_BASE_URL = 'https://fapi.binance.com';
const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;

function createSignature(queryString) {
  return crypto.createHmac('sha256', API_SECRET).update(queryString).digest('hex');
}

function createAuthHeaders() {
  return {
    'X-MBX-APIKEY': API_KEY
  };
}

app.get('/', (req, res) => {
  res.json({ 
    message: 'Binance Futures API Server',
    endpoints: {
      '/account': 'Get account balance',
      '/positions': 'Get current positions',
      '/ticker/:symbol': 'Get ticker price for symbol',
      '/klines/:symbol': 'Get kline data for symbol'
    }
  });
});

app.get('/account', async (req, res) => {
  try {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = createSignature(queryString);
    
    const response = await axios.get(
      `${BINANCE_BASE_URL}/fapi/v2/account?${queryString}&signature=${signature}`,
      { headers: createAuthHeaders() }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch account data',
      details: error.response?.data || error.message 
    });
  }
});

app.get('/positions', async (req, res) => {
  try {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = createSignature(queryString);
    
    const response = await axios.get(
      `${BINANCE_BASE_URL}/fapi/v2/positionRisk?${queryString}&signature=${signature}`,
      { headers: createAuthHeaders() }
    );
    
    const activePositions = response.data.filter(pos => parseFloat(pos.positionAmt) !== 0);
    res.json(activePositions);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch positions',
      details: error.response?.data || error.message 
    });
  }
});

app.get('/ticker/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const response = await axios.get(
      `${BINANCE_BASE_URL}/fapi/v1/ticker/24hr?symbol=${symbol.toUpperCase()}`
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch ticker data',
      details: error.response?.data || error.message 
    });
  }
});

app.get('/klines/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '1h', limit = 100 } = req.query;
    
    const response = await axios.get(
      `${BINANCE_BASE_URL}/fapi/v1/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch kline data',
      details: error.response?.data || error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});