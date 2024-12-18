const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const stores = [
  { id: 1, name: 'Walmart', address: '123 Wally St', products: ['Apples', 'Bananas'] },
  { id: 2, name: 'Whole Foods', address: '456 Holly Ave', products: ['Bananas', 'Oranges'] },
  { id: 3, name: 'Food City', address: '789 Folly Rd', products: ['Cherries', 'Apples'] },
];

app.get('/stores', (req, res) => {
  const { product } = req.query;
  const radius = req.query.radius;

  if (!product) {
    return res.status(400).json({ error: 'Product query parameter is required' });
  }

  const filteredStores = stores.filter(store => store.products.includes(product));
  res.json({ stores: filteredStores });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
