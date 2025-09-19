const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/lockers", require("./routes"));
app.use(express.static(path.join(__dirname, "./public")));

app.listen(PORT, () => console.log("App running in port ", PORT));
