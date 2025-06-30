const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Contoh: /api?ids=supra-token,usd-coin&vs_currency=usd
app.get('/', async (req, res) => {
    const ids = req.query.ids; // koma pisah
    const vs_currency = req.query.vs_currency || 'usd';

    if (!ids) {
        return res.status(400).json({ error: "Missing 'ids' query (e.g., ?ids=bitcoin,ethereum)" });
    }

    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price`,
            {
                params: {
                    ids,
                    vs_currencies: vs_currency
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("CoinGecko Proxy Error:", error.message);
        res.status(500).json({ error: "Failed to fetch data from CoinGecko." });
    }
});

module.exports = app;
