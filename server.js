const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

// Serve static frontend (React Build)
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all for SPA - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`WuffChat UI running on port ${PORT}`);
  console.log(`Build timestamp: ${new Date().toISOString()}`);
});
