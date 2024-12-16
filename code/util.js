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
