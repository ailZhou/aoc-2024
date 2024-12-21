window.onload = function () {
  var fileInput = document.getElementById("day16Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        // part1(data);
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
    .replace(/\n/g, ",")
    .split(",")
    .map((row) => row.split(""));
}

function run() {
  const data = parse(
    "###############\n#.......#....E#\n#.#.###.#.###.#\n#.....#.#...#.#\n#.###.#####.#.#\n#.#.#.......#.#\n#.#.#####.###.#\n#...........#.#\n###.#.#####.#.#\n#...#.....#.#.#\n#.#.#.###.#.#.#\n#.....#...#.#.#\n#.###.#.#.#.#.#\n#S..#.....#...#\n###############"
  );
  // part1(data);
  part2(data);
}

const dir = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];

function turns(currDir, nextDir) {
  let dirList;
  switch (currDir) {
    case "n":
      dirList = { n: 0, e: 1, s: 2, w: 3 };
      break;
    case "e":
      dirList = { e: 0, s: 1, w: 2, n: 3 };
      break;
    case "s":
      dirList = { s: 0, w: 1, n: 2, e: 3 };
      break;
    case "w":
      dirList = { w: 0, n: 1, e: 2, s: 3 };
      break;
  }
  return dirList[nextDir];
}

const compassDir = [
  { x: 0, y: -1, dir: "n" },
  { x: 1, y: 0, dir: "e" },
  { x: 0, y: 1, dir: "s" },
  { x: -1, y: 0, dir: "w" },
];

function findPaths(start, end, paths, height) {
  const visitedPaths = [];
  const globalVisited = {};
  const unvisitedPaths = [{ path: start.index, dir: start.dir }];
  let bestPath;
  while (unvisitedPaths.length > 0) {
    //get shortest unvisitedPath instead of the last one
    unvisitedPaths.sort((a, b) => {
      return b.cost - a.cost;
    });
    const currPath = unvisitedPaths.pop();

    const curr = paths.get(currPath.path);
    const currDir = currPath.dir;
    globalVisited[curr.index] = true;

    if (curr.x == end.x && curr.y == end.y) {
      bestPath = currPath;
      visitedPaths.push(currPath);
      break;
    }

    const nextDir = compassDir.map((dir) => {
      return {
        index: buildIndex(dir.x + curr.x, dir.y + curr.y, height),
        dir: dir.dir,
      };
    });

    const viableNext = nextDir.filter(
      (next) => !globalVisited[next.index] && paths.has(next.index)
    );

    if (viableNext.length == 0) {
      currPath.path = "W";
      visitedPaths.push(currPath);
    } else {
      for (var i = 0; i < viableNext.length; i++) {
        //calculate cost to visit
        const currCost = currPath.cost ?? 0;
        const nextPathCost = turns(currDir, viableNext[i].dir) == 0 ? 1 : 1001;

        unvisitedPaths.push({
          path: viableNext[i].index,
          dir: viableNext[i].dir,
          cost: currCost + nextPathCost,
        });
      }
    }
  }
  return bestPath;
}

function part1(map) {
  let reindeer = {};
  let end = {};
  const pathMap = new Map();
  const height = map.length;

  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      const index = buildIndex(x, y, height);
      if (map[y][x] == ".") {
        pathMap.set(index, { x, y, index });
      } else if (map[y][x] == "S") {
        reindeer = { x, y, index, dir: "e" };
        pathMap.set(index, { x, y, index });
      } else if (map[y][x] == "E") {
        end = { x, y, index };
        pathMap.set(index, { x, y, index });
      }
    }
  }
  console.log(findPaths(reindeer, end, pathMap, height, structuredClone(map)));
}

function findAllBestPaths(start, end, paths, height, bestCost) {
  const visitedPaths = [];
  const bestPaths = [];
  const globalVisited = {};
  const unvisitedPaths = [{ path: start.index, dir: start.dir, visited: [] }];
  while (unvisitedPaths.length > 0) {
    //get shortest unvisitedPath instead of the last one
    unvisitedPaths.sort((a, b) => {
      return b.cost - a.cost;
    });
    const currPath = unvisitedPaths.pop();
    const curr = paths.get(currPath.path);
    const currDir = currPath.dir;
    currPath.visited.push(curr.index);
    globalVisited[curr.index] = {dir: currDir, cost: currPath.cost};

    if (curr.x == end.x && curr.y == end.y) {
      currPath.path = "E";
      bestPaths.push(currPath);
      continue;
    }

    const nextDir = compassDir.map((dir) => {
      return {
        index: buildIndex(dir.x + curr.x, dir.y + curr.y, height),
        dir: dir.dir,
      };
    });

    const viableNext = nextDir.filter(
      (next) => !globalVisited[next.index] && paths.has(next.index)
    );

    if (viableNext.length == 0) {
      currPath.path = "W";
      visitedPaths.push(currPath);
    } else {
      for (var i = 0; i < viableNext.length; i++) {
        //calculate cost to visit
        const currCost = currPath.cost ?? 0;
        const nextPathCost = turns(currDir, viableNext[i].dir) == 0 ? 1 : 1001;
        const totalCost = currCost + nextPathCost;

        if (totalCost <= bestCost) {
          unvisitedPaths.push({
            visited: [...currPath.visited],
            path: viableNext[i].index,
            dir: viableNext[i].dir,
            cost: totalCost,
          });
        }
      }
    }
  }

  console.log(globalVisited);
  return bestPaths;
}

function part2(map) {
  let reindeer = {};
  let end = {};
  const pathMap = new Map();
  const height = map.length;

  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      const index = buildIndex(x, y, height);
      if (map[y][x] == ".") {
        pathMap.set(index, { x, y, index });
      } else if (map[y][x] == "S") {
        reindeer = { x, y, index, dir: "e" };
        pathMap.set(index, { x, y, index });
      } else if (map[y][x] == "E") {
        end = { x, y, index };
        pathMap.set(index, { x, y, index });
      }
    }
  }

  const bestCost = findPaths(reindeer, end, pathMap, height).cost;
  console.log("bestCost", bestCost);
  console.log(findAllBestPaths(reindeer, end, pathMap, height, bestCost));
}

function fillMap(map, points, symbol) {
  for (var i = 0; i < points.length; i++) {
    map[points[i].y][points[i].x] = symbol;
  }
  console.log(map.map((points) => points.join("")).join("\n"));
}

run();
