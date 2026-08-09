import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/devtrack";

mongoose.connect(uri)
  .then(() => app.listen(port, () => console.log(`DevTrack API listening on ${port}`)))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
