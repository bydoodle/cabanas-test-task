import { readFileSync } from "fs";
import { config } from "./config";

type TileType = "cabana" | "pool" | "path" | "chalet" | "empty";

type ShapeName = "cross" | "split" | "straight" | "corner" | "end" | "isolated";
type Shape = [ShapeName, number];

type Tile = {
  x: number;
  y: number;
  type: TileType;
  id?: number;
  shape?: Shape;
  available?: boolean;
  pathDirections?: string;
};

type MapResponse = {
  rows: Tile[][];
};

// index of element is important
// 0 - left; 1 - top; 2 - right; 3 - bottom;
const pathsToCheck = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1]
]

const map = parseMap(
    readFileSync(config.map, "utf8")
);

function getRawCell(rawRows: string[], x: number, y: number): string {
  if (y < 0 || y >= rawRows.length) return ".";
  const row = rawRows[y];
  if (x < 0 || x >= row.length) return ".";
  return row[x];
}

function getTile(rows: Tile[][], x: number, y: number): Tile | null {
  if (y < 0 || y >= rows.length) return null;
  const row = rows[y];
  if (x < 0 || x >= row.length) return null;
  return row[x] ?? null;
}

function checkShape(coords: [number, number], rawRows: string[], directions?: number[]): Shape {
  if (!directions) {
    directions = [];
    for (let path = 0; path < pathsToCheck.length; path++) {
      const [dx, dy] = pathsToCheck[path];
      const cell = getRawCell(rawRows, coords[0] + dx, coords[1] + dy);
      directions.push(cell !== "." ? 1 : 0);
    } 
  }

  const neighborCount = directions.filter((x) => x === 1).length;

  switch(neighborCount) {
    case 4:
      return ["cross", 0];
 
    case 3: {
      switch (directions.indexOf(0)) {
        case 0:
          return ["split", 0];
        case 1:
          return ["split", 90];
        case 2:
          return ["split", 180];
        default: // case 3
          return ["split", 270];
      }
    }
 
    case 2: {
      if (directions[0] && directions[2]) {
        return ["straight", 90];
      } else if (directions[1] && directions[3]) {
        return ["straight", 0];
      } else {
        if (directions[0] && directions[1]) {
          return ["corner", 270];
        } else if (directions[1] && directions[2]) {
          return ["corner", 0];
        } else if (directions[2] && directions[3]) {
          return ["corner", 90];
        } else {
          return ["corner", 180];
        }
      }
    }
 
    case 1: {
      switch (directions.indexOf(1)) {
        case 0:
          return ["end", 90];
        case 1:
          return ["end", 180];
        case 2:
          return ["end", 270];
        default: // case 3
          return ["end", 0];
      }
    }
 
    default:
      return ["end", 0];
  }
}

function parseMap(mapText: string): MapResponse {
  let cabanaId = 1;
  const rawRows = mapText.trim().split("\n");

  const rows: Tile[][] = rawRows.map((row, y) => 
    [...row].map((cell, x): Tile => {
      switch (cell) {
        case "W":
          return {
            id: cabanaId++,
            x,
            y,
            type: "cabana",
            available: true,
            pathDirections: '',
          };

        case "p":
          return {
            x,
            y,
            type: "pool",
            pathDirections: '',
          };

        case "#":
          return {
            x,
            y,
            type: "path",
            shape: checkShape([x, y], rawRows),
          };

        case "c":
          return {
            x,
            y,
            type: "chalet",
            pathDirections: '',
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
  
  const buildings = rows.flatMap((row) =>
    row.filter(
      (cell) => cell.type !== "empty" && cell.type !== "path"
    )
  )

  buildings.map((cell) => {
    const possiblePaths: (false | [number,number])[] = [];
    for (let i = 0; i < pathsToCheck.length; i++) {
      const [dx, dy] = pathsToCheck[i];
      const neighbor = getTile(rows, cell.x + dx, cell.y + dy);
      possiblePaths.push(
        neighbor && neighbor.type === "path" ? [cell.y + dy, cell.x + dx] : false
      );
    }

    if (possiblePaths[3]) {
      cell.pathDirections = 'bottom'
    } else if (possiblePaths[1]) {
      cell.pathDirections = 'top'
    } else if (possiblePaths[0] && possiblePaths[2]) {
      cell.pathDirections = 'leftright'
    } else {
      cell.pathDirections = possiblePaths[0] ? 'left' : 'right'
    }

    const realPaths = possiblePaths.filter((path): path is [number, number] => path !== false);
    
    if (realPaths.length > 1) { 
      possiblePaths.forEach((path) => {
        if (!path) return;
        
        const [pathRow, pathCol] = path;
        const directions: number[] = [];
      
        for (let i = 0; i < pathsToCheck.length; i++) {
          const [dx, dy] = pathsToCheck[i];
          const neighbor = getTile(rows, pathCol + dx, pathRow + dy);

          if (!neighbor) {
            directions.push(0);
            continue;
          }

          if (neighbor.pathDirections) {
            if (i == 0 &&
              (neighbor.pathDirections === 'right' || neighbor.pathDirections === 'leftright')) {
              directions.push(1)
            } else if (i == 1 && neighbor.pathDirections === 'bottom') {
              directions.push(1)
            } else if (i == 2 &&
              (neighbor.pathDirections === 'left' || neighbor.pathDirections === 'leftright')) {
              directions.push(1)
            } else if (i == 3 && neighbor.pathDirections === 'top') {
              directions.push(1)
            } else {
              directions.push(0)
            }
          } else if (neighbor.type === 'path') {
            directions.push(1)
          } else {
            directions.push(0)
          }
        }
        rows[pathRow][pathCol].shape = checkShape([pathRow, pathCol], rawRows, directions);
      })
    }
  })
  return { rows };
}

export function getMap() {
  return map;
}