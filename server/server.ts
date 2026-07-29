import express from "express";
import cors from "cors";
import { getMap } from "./map";
import { bookCabana } from "./booking";
import { config } from "./config";

console.log(config.map);
console.log(config.bookings);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/map", (req, res) => {
    res.json(getMap());
});

app.post("/api/book", (req, res) => {
    res.json(bookCabana(req.body));
});

app.listen(3000);