import server from './app/app';

const { conn } = require('./app/db');
const PORT = process.env.PORT || 3001;

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log("server listening at 3001");
  });
});