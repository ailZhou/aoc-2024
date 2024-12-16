window.onload = function () {
  var fileInput = document.getElementById("day15Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        const map = data.filter(
          (item) => !(item.includes(">") || item.includes("<"))
        );
        const movements = data.filter(
          (item) => item.includes(">") || item.includes("<")
        );

        part1(movements, map);
        part2(movements, map);
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
    .filter((item) => item != "");
}

const move = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  "<": { x: -1, y: 0 },
  v: { x: 0, y: +1 },
};

function isBlocked(item) {
  return item == "O" || item == "[" || item == "]";
}

function blockChain(current, obstacles, displacement, blockList) {
  const { index, connect } = current;
  blockList.push(index);
  blockList.push(connect);

  const nextPos = [index, connect].filter((item) => item).map((index) => {
    return {
      x: obstacles[index].x + displacement.x,
      y: obstacles[index].y + displacement.y,
    };
  });

  const blockages = obstacles.filter(
    (obstacle) =>
      !blockList.includes(obstacle.index) &&
      nextPos.find(
        (next) =>
          obstacle.x == next.x &&
          obstacle.y == next.y &&
          (obstacle.item == "#" || isBlocked(obstacle.item))
      )
  );
  const isWall = blockages.filter((block) => block.item == "#");
  if (blockages.length == 0) {
    return blockList;
  } else if (isWall.length > 0) {
    blockList.push(isWall[0].index);
    return blockList;
  } else {
    for (const block of blockages) {
      blockChain(block, obstacles, displacement, blockList);
    }
    return blockList;
  }
}

function movement(robot, obstacles, movements, moveIndex, map) {
  if (moveIndex === movements.length) {
    return robot;
  } else {
    const displacement = move[movements[moveIndex]];
    const nextPos = {
      x: robot.x + displacement.x,
      y: robot.y + displacement.y,
    };

    let blockage = obstacles.find(
      (obj) => obj.x == nextPos.x && obj.y == nextPos.y
    );

    if (blockage) {
      if (isBlocked(blockage.item)) {
        const blockKeys = blockChain(blockage, obstacles, displacement, []).filter((onlyUnique));

        const blockList = obstacles.filter((ob) =>
          blockKeys.includes(ob.index)
        );
        const isWall = blockList.filter((block) => block.item == "#");
        //no wall found means move things
        if (isWall.length == 0) {
          for (const block of blockList) {
            // obstacles
            const item = obstacles.find((key) => key.index == block.index);
            item.x = item.x + displacement.x;
            item.y = item.y + displacement.y;
          }
          robot = nextPos;
        }
      }
    } else {
      robot = nextPos;
    }
    return movement(robot, obstacles, movements, (moveIndex += 1), map);
  }
}

function part1(movements, map) {
  let robot = {};
  const obstacles = [];

  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      if (map[y][x] == "#" || map[y][x] == "O") {
        obstacles.push({ item: map[y][x], x, y, index: obstacles.length });
      } else if (map[y][x] == "@") {
        robot = { x, y };
      }
    }
  }

  for (var i = 0; i < movements.length; i++) {
    robot = movement(robot, obstacles, movements[i], 0);
  }

  const inventory = obstacles.filter((block) => block.item == "O");
  const gps = inventory.map((block) => block.y * 100 + block.x);
  const sum = gps.reduce((sum, value) => sum + value, 0);
  console.log(sum);

  drawMap(map, obstacles);
}

function part2(movements, map) {
  const expandedMap = map.map((item) =>
    item
      .replace(/\#/g, "##")
      .replace(/\./g, "..")
      .replace(/\O/g, "[]")
      .replace(/\@/g, "@.")
  );

  let robot = {};
  const obstacles = [];

  for (var y = 0; y < expandedMap.length; y++) {
    for (var x = 0; x < expandedMap[y].length; x++) {
      if (expandedMap[y][x] == "#" || expandedMap[y][x] == "[") {
        obstacles.push({
          item: expandedMap[y][x],
          x,
          y,
          index: obstacles.length,
          connect: obstacles.length + 1,
        });
      } else if (expandedMap[y][x] == "]") {
        obstacles.push({
          item: expandedMap[y][x],
          x,
          y,
          index: obstacles.length,
          connect: obstacles.length - 1,
        });
      } else if (expandedMap[y][x] == "@") {
        robot = { x, y };
      }
    }
  }

  for (var i = 0; i < movements.length; i++) {
    robot = movement(robot, obstacles, movements[i], 0, expandedMap);
  }

  const inventory = obstacles.filter((block) => block.item == "[");
  const gps = inventory.map((block) => block.y * 100 + block.x);
  const sum = gps.reduce((sum, value) => sum + value, 0);
  console.log(sum);

  drawMap(expandedMap, obstacles);
}
