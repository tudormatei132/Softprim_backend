require('dotenv').config();

const app = require('./app');
const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

server.on('error', (err) => console.error('Error starting server:', err));
