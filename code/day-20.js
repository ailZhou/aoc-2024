window.onload = function () {
  var fileInput = document.getElementById("day20Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        part1(data);
      };

      reader.readAsText(file);
    } else {
      console.log("file not supported");
    }
  });
};

function parse(data) {
  return data
    .replace(/\n/g, ",")
    .split(",")
    .map((row) => row.split(""));
}

function findPaths(start, end, paths, grid) {
  const closedPaths = new Map();
  const openPaths = [{ pathIndex: start.index, weight: 0, g: 0 }];
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

function findBlocks(map, grid) {
  const blockMap = new Map();
  for (var y = 1; y < map.length - 1; y++) {
    for (var x = 1; x < map[0].length - 1; x++) {
      const index = buildIndex(x, y, grid);
      if (map[y][x] == "#") {
        blockMap.set(index, { x, y, index });
      }
    }
  }

  return blockMap;
}

function part1(map) {
  console.log("run");

  const grid = map.length;
  const blockMap = findBlocks(map, grid);

  let start;
  let end;

  const pathMap = new Map();
  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      const index = buildIndex(x, y, grid);
      if (map[y][x] == ".") {
        pathMap.set(index, { x, y, index });
      }
      if (map[y][x] == "S") {
        pathMap.set(index, { x, y, index });
        start = { x, y, index };
      }
      if (map[y][x] == "E") {
        pathMap.set(index, { x, y, index });
        end = { x, y, index };
      }
    }
  }

  const init = findPaths(start, end, pathMap, grid);
  const maxPico = calculatePicoSeconds(init, end);

  const savedList = new Map();
  for (const block of blockMap) {
    const copyPath = structuredClone(pathMap);
    copyPath.set(block[0], block[1]);
    const nodeList = findPaths(start, end, copyPath, grid);
    const saved = maxPico - calculatePicoSeconds(nodeList, end);

    if (savedList.has(saved)) {
      savedList.set(saved, savedList.get(saved) + 1);
    } else savedList.set(saved, 1);

    console.log("saved", saved);
  }

  let total = 0;
  for (const saved of savedList) {
    if (saved[0] >= 100) {
      total += saved[1];
    }
  }
  console.log("total", total);
}

function calculatePicoSeconds(nodeList, end) {
  const lastNode = nodeList.find((node) => node.pathIndex == end.index);
  const indexes = [lastNode.pathIndex];

  let currNode = lastNode.parent;
  while (currNode != 0) {
    const find = nodeList.find((node) => node.pathIndex == currNode);
    indexes.push(currNode);

    if (find.parent) currNode = find.parent;
    else break;
  }

  return indexes.length - 1;
}
