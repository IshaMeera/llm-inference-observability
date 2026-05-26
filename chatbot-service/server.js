require("dotenv").config();
const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
   res.json({
    ok: true,
  });
  console.log("Health check endpoint hit");
});

app.use("/chat", chatRoutes);
app.use("/stream", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});