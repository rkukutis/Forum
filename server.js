// Import config.env into environment variables
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// Start server
const port = process.env.BACKEND_PORT || 8000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}`);
});
