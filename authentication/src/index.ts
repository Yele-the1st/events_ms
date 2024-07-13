import express from "express";
import morganMiddleware from "./api/middlewares/morgan";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8001;

// Use Morgan for HTTP request logging with Winston integration
app.use(morganMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
