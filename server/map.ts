import { readFileSync } from "fs";
import { config } from "./config";

type Tile = {
  x: number;
  y: number;
  type: "cabana" | "pool" | "path" | "chalet" | "empty";
  id?: number;
  shape?: {
    name: string;
    rotation: number;
  };
  available?: boolean;
};

type MapResponse = {
  rows: Tile[][];
};

const pathsToCheck = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1]
]

const map = parseMap(
    readFileSync(config.map, "utf8")
);

function checkShape(coords, map) {
  let directions = [];
  for (let path = 0; path < pathsToCheck.length; path++) {
    if (map[coords[1] - pathsToCheck[path][1]][coords[0] - pathsToCheck[path][0]] != '.') {
      directions.push(1)
    } else {
      directions.push(0)
    }
  }
  switch(directions.filter(x => x == 1).length) {
    case 4:
      return ['cross', 0];
      break;
    case 3:
      switch(directions.indexOf(0)) {
        case 0:
          return ['split', 180];
          break;
        case 1:
          return ['split', 270];
          break;
        case 2:
          return ['split', 0];
          break;
        default:
          return ['split', 90];
          break;
      }
      break;
    case 2:
      if (directions[0] && directions[2]) {
        return ['straight', 90];
      } else if (directions[1] && directions[3]) {
        return ['straight', 0];
      } else {
        if (directions[0] && directions[1]) {
          return ['corner', 90];
        } else if (directions[1] && directions[2]) {
          return ['corner', 180];
        } else if (directions[2] && directions[3]) {
          return ['corner', 270];
        } else {
          return ['corner', 0];
        }
      }
      break;
    default:
      switch(directions.indexOf(1)) {
        case 0:
          return ['end', 270];
          break;
        case 1:
          return ['end', 0];
          break;
        case 2:
          return ['end', 90];
          break;
        case 3:
          return ['end', 180];
          break;
      }
      break;
  }
}

function parseMap(map: string): MapResponse {
  let cabanaId = 1;

  const rows = map
    .trim()
    .split("\n")
    .map((row, y) =>
      [...row].map((cell, x): Tile => {
        switch (cell) {
          case "W":
            return {
              id: cabanaId++,
              x,
              y,
              type: "cabana",
              available: true,
            };

          case "p":
            return {
              x,
              y,
              type: "pool",
            };

          case "#":
            return {
              x,
              y,
              type: "path",
              shape: checkShape([x, y], map.trim().split("\n")),
            };

          case "c":
            return {
              x,
              y,
              type: "chalet",
            };

          default:
            return {
              x,
              y,
              type: "empty",
            };
        }
      })
    );

  return { rows };
}

export function getMap() {
    return map;
}