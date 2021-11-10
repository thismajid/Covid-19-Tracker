const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const getCountries = require("./tools/getCountries");

const apiRouter = require("./routes/api");

const app = express();
getCountries();

const corsOptions = {
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);

const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(`Server is running on localhost:${port} ...`);
});
