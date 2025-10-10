import { PORT } from "./config/config.js";
import app from "./app.js";
import { connectDB } from "./config/db.js";


  // Connect to MongoDB
  connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
