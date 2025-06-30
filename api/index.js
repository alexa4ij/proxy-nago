const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
  const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
  const symbols = req.query.symbol;
  const convert = req.query.convert || 'USD';

  if (!COINMARKETCAP_API_KEY) {
    return res.status(500).json({ error: 'API Key not set.' });
  }

  if (!symbols) {
    return res.status(400).json({ error: 'Missing symbol parameter.' });
  }

  try {
    const response = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`,
      {
        params: {
          symbol: symbols,
          convert: convert
        },
        headers: {
          'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    const rawData = response.data;
    const prices = {};

    for (const symbol of symbols.split(',')) {
      const price = rawData?.data?.[symbol]?.quote?.[convert]?.price;
      if (price !== undefined) {
        prices[symbol] = price;
      }
    }

    res.json({
      success: true,
      prices
    });

  } catch (error) {
    console.error('CMC Proxy Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch from CoinMarketCap.' });
  }
});

module.exports = app;
