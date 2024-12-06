window.onload = function () {
  var fileInput = document.getElementById("day06Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        let guard = findGuard(data);
        countPath(structuredClone(data));
        runObstructions(data, guard);
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
    .map((item) => Array.from(item));
}

const nextDir = {
  up: "right",
  right: "down",
  down: "left",
  left: "up",
};

const iconDir = {
  up: "^",
  right: ">",
  down: "v",
  left: "<",
};

function findGuard(data) {
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      if (data[i][j] === "^") {
        return { dir: "up", x: j, y: i };
      }
    }
  }
}

function countPath(data) {
  let guard = findGuard(data);

  let nextPath = {};
  for (var i = 0; i < 10000; i++) {
    if (guard.dir === "up") {
      nextPath = { x: guard.x, y: guard.y - 1 };
    } else if (guard.dir === "right") {
      nextPath = { x: guard.x + 1, y: guard.y };
    } else if (guard.dir === "down") {
      nextPath = { x: guard.x, y: guard.y + 1 };
    } else if (guard.dir === "left") {
      nextPath = { x: guard.x - 1, y: guard.y };
    }

    if (
      data[nextPath.y] === undefined ||
      data[nextPath.y][nextPath.x] === undefined
    ) {
      continue;
    }

    if (
      data[nextPath.y][nextPath.x] != "#" &&
      data[nextPath.y][nextPath.x] != "O"
    ) {
      data[nextPath.y][nextPath.x] = "X";
      guard.x = nextPath.x;
      guard.y = nextPath.y;
    } else {
      guard.dir = nextDir[guard.dir];
    }
  }

  return guard;

  // const count = data
  //   .map((item) => item.filter((cell) => cell === "X").length)
  //   .filter((num) => num);
  // const sum = count.reduce((sum, value) => sum + value, 0);
  // console.log(sum);
}

function runObstructions(data) {
  const guardPos = [];

  const height = data.length - 1;
  const width = data[0].length - 1;

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      if (data[i][j] != "#" && data[i][j] != "^") {
        const cloneMap = structuredClone(data);
        cloneMap[i][j] = "O";
        guardPos.push(countPath(cloneMap));
      }
    }
  }

  const obstructured = guardPos.filter((pos) => {
    if (pos.dir === "up") {
      return pos.y === 0;
    }
    if (pos.dir === "down") {
      return pos.y === height;
    }
    if (pos.dir === "left") {
      return pos.x === 0;
    }
    if (pos.dir === "right") {
      return pos.x === width;
    }
    return false;
  });
  console.log(guardPos.length - obstructured.length);
}
