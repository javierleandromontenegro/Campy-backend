import server from './app/app';
import db from './app/db';

const { conn } = db;
const PORT = process.env.PORT || 3001;

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log("server listening at 3001");
  });
});