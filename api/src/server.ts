import app from "./app";
import { config } from "./config/env";


import dotenv from "dotenv";
dotenv.config();

app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});
