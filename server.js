const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/chat', (req, res) => {
  const msg = req.query.msg || '';
  res.send(`You said: ${msg}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
