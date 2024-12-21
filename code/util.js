function findPoint(points, x, y) {}

function buildMap(width, height) {
  let map = [];
  for (var x = 0; x < height; x++) {
    map[x] = [];
    for (var y = 0; y < width; y++) {
      map[x][y] = ".";
    }
  }
  return map;
}

function drawMap(map, points) {
  const newMap = buildMap(map[0].length, map.length);

  for (var i = 0; i < points.length; i++) {
    newMap[points[i].y][points[i].x] = points[i].item;
  }
  console.log(newMap.map((points) => points.join("")).join("\n"));
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}


function buildIndex(x, y, height) {
  return y * height + x;
}

const dir = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];

function calculateH(curr, end) {
  return (end.x - curr.x + (end.y - curr.y)) * 10;
}

const compassDir = [
  { x: 0, y: -1, dir: "n" },
  { x: 1, y: 0, dir: "e" },
  { x: 0, y: 1, dir: "s" },
  { x: -1, y: 0, dir: "w" },
];

function nextPaths(curr, paths, closedPaths, grid) {
  return compassDir
    .map((compass) => {
      const x = curr.x + compass.x;
      const y = curr.y + compass.y;
      if (x >= 0 && x < grid && y >= 0 && y < grid) {
        return {
          index: buildIndex(x, y, grid),
          dir: compass.dir,
        };
      }
      return undefined;
    })
    .filter((next) => next)
    .filter((next) => paths.has(next.index) && !closedPaths.has(next.index));
}