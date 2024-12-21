window.onload = function () {
  var fileInput = document.getElementById("day18Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        part1(data);
        part2(data);
      };

      reader.readAsText(file);
    } else {
      console.log("file not supported");
    }
  });
};

function parse(data) {
  return data
    .replace(/\n/g, "|")
    .split("|")
    .map((coord) => {
      const points = coord.split(",");
      return { x: points[0], y: points[1] };
    });
}

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

function findPaths(start, end, paths, grid) {
  const closedPaths = new Map();
  const openPaths = [
    { pathIndex: start.index, dir: start.dir, weight: 0, g: 0 },
  ];
  const traveled = [];

  while (openPaths.length > 0) {
    openPaths.sort((a, b) => {
      return b.weight - a.weight;
    });
    const node = openPaths.pop();
    const nodeData = paths.get(node.pathIndex);
    closedPaths.set(node.pathIndex, true);
    traveled.push(node);

    if (nodeData.x == end.x && nodeData.y == end.y) break;

    const nextNodes = nextPaths(nodeData, paths, closedPaths, grid);
    for (var i = 0; i < nextNodes.length; i++) {
      const h = calculateH(paths.get(nextNodes[i].index), end);
      const g = node.g + 10;
      const weight = h + g;

      const next = {
        parent: node.pathIndex,
        pathIndex: nextNodes[i].index,
        dir: nextNodes[i].dir,
        h,
        g,
        weight,
      };

      const nodeActive = openPaths.findIndex(
        (node) => node.pathIndex == next.pathIndex
      );
      if (nodeActive == -1) {
        openPaths.push(next);
      } else {
        if (nodeActive.distance > next.distance) {
          openPaths[nodeActive].parent = node.pathIndex;
          openPaths[nodeActive].g = g;
          openPaths[nodeActive].total =
            openPaths[nodeActive].h + openPaths[nodeActive].g;
        }
      }
    }
  }
  return traveled;
}

function part1(coords) {
  const grid = 71;
  const bytesLength = 1024;
  const map = buildMap(grid, grid);
  for (var i = 0; i < bytesLength; i++) {
    map[coords[i].y][coords[i].x] = "#";
  }

  const start = { x: 0, y: 0, index: buildIndex(0, 0, grid) };
  const end = {
    x: grid - 1,
    y: grid - 1,
    index: buildIndex(grid - 1, grid - 1, grid),
  };
  const pathMap = new Map();
  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      const index = buildIndex(x, y, grid);
      if (map[y][x] == ".") {
        pathMap.set(index, { x, y, index });
      }
    }
  }

  const nodeList = findPaths(start, end, pathMap, grid, false);
  const lastNode = nodeList.find((node) => node.pathIndex == end.index);
  const indexes = [lastNode.pathIndex];

  let currNode = lastNode.parent;
  while (currNode != 0) {
    const find = nodeList.find((node) => node.pathIndex == currNode);
    indexes.push(currNode);
    currNode = find.parent;
  }
  console.log("traveled", indexes.length);
}

function part2(coords) {
  const grid = 71;
  const bytesLength = 1024;
  const map = buildMap(grid, grid);
  for (var i = 0; i < bytesLength; i++) {
    map[coords[i].y][coords[i].x] = "#";
  }

  for (var i = bytesLength; i < coords.length; i++) {
    map[coords[i].y][coords[i].x] = "#";

    const start = { x: 0, y: 0, index: buildIndex(0, 0, grid) };
    const end = {
      x: grid - 1,
      y: grid - 1,
      index: buildIndex(grid - 1, grid - 1, grid),
    };
    const pathMap = new Map();
    for (var y = 0; y < map.length; y++) {
      for (var x = 0; x < map[y].length; x++) {
        const index = buildIndex(x, y, grid);
        if (map[y][x] == ".") {
          pathMap.set(index, { x, y, index });
        }
      }
    }

    const nodeList = findPaths(start, end, pathMap, grid, false);
    const lastNode = nodeList.find((node) => node.pathIndex == end.index);
    if (lastNode == undefined) {
      console.log(coords[i]);
      break;
    }
  }
}
