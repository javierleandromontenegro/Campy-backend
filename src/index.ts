import { sign } from "jsonwebtoken";
import server from "./app/app";
import { dueDate, sendEmail, sendFormReview } from "./app/email/sendEmail";
import templateReview from "./app/email/templateReview";

const { conn } = require("./app/db");
const PORT = process.env.PORT || 3001;

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log("server listening at 3001");

    sendEmail({
      userEmail: "leandromontenegroeventos@gmail.com",
      subject: "Llenar formulario de review de camping.",
      html: templateReview(
        String(23),
        String(85),
        sign(
          { email: "leandromontenegroeventos@gmail.com" },
          String(process.env.SECRET)
        ),

        "javierleandro"
      ),
    });

    setInterval(() => {
      dueDate();
      sendFormReview();
    }, 86400 * 1000);
  });
});
