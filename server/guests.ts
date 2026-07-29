import { readFileSync } from "fs";
import { config } from "./config";

export const guests = JSON.parse(
  readFileSync(config.bookings, "utf8")
);