import minimist from "minimist";

const args = minimist(process.argv.slice(2));

export const config = {
  map: args.map ?? "data/map.ascii",
  bookings: args.bookings ?? "data/bookings.json",
};