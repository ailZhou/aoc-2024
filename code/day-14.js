window.onload = function () {
  var fileInput = document.getElementById("day14Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        console.log(reader.result.toString().replace(/\n/g, "|"));
        const data = parse(reader.result.toString());
        part1(structuredClone(data));
        part2(structuredClone(data));
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
    .map((info) => {
      return {
        p: info.split(" ")[0].replace("p=", "").split(","),
        v: info.split(" ")[1].replace("v=", "").split(","),
      };
    });
}

const empty = ".";

const width = 101;
const height = 103;


function buildMap(width, height) {
  let map = [];
  for (var x = 0; x < height; x++) {
    map[x] = [];
    for (var y = 0; y < width; y++) {
      map[x][y] = empty;
    }
  }

  return map;
}

function movement(robots, seconds) {
  if (seconds === 0) {
    return robots;
  } else {
    robots.map((robot) => {
      let newX = robot.p.x + robot.v.x;
      let newY = robot.p.y + robot.v.y;
      //robot is moving right
      if (robot.v.x > 0 && newX >= width) {
        newX = newX % width;
      }
      //robot is moving left
      else if (robot.v.x < 0 && newX < 0) {
        newX = width + newX;
      }
      //robot is moving down
      if (robot.v.y > 0 && newY >= height) {
        newY = newY % height;
      }
      //robot is moving up
      else if (robot.v.y < 0 && newY < 0) {
        newY = height + newY;
      }

      robot.p.x = newX;
      robot.p.y = newY;
    });
  }
  return movement(robots, seconds - 1);
}

function buildQuadrants(newData, midX, midY) {
  const quadrant1 = newData.filter(
    (robot) =>
      robot.p.x >= 0 && robot.p.x < midX && robot.p.y >= 0 && robot.p.y < midY
  );
  const quadrant2 = newData.filter(
    (robot) =>
      robot.p.x > midX &&
      robot.p.x < width &&
      robot.p.y >= 0 &&
      robot.p.y < midY
  );
  const quadrant3 = newData.filter(
    (robot) =>
      robot.p.x >= 0 &&
      robot.p.x < midX &&
      robot.p.y > midY &&
      robot.p.y < height
  );
  const quadrant4 = newData.filter(
    (robot) =>
      robot.p.x > midX &&
      robot.p.x < width &&
      robot.p.y > midY &&
      robot.p.y < height
  );
  return [quadrant1, quadrant2, quadrant3, quadrant4];
}

function part1(data) {
  for (const robot of data) {
    robot.p = { x: parseInt(robot.p[0]), y: parseInt(robot.p[1]) };
    robot.v = { x: parseInt(robot.v[0]), y: parseInt(robot.v[1]) };
  }

  const newData = movement(data, 100);
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  const quadrants = buildQuadrants(newData, midX, midY);
  console.log(
    quadrants[0].length *
      quadrants[1].length *
      quadrants[2].length *
      quadrants[3].length
  );
}

function part2(data) {
  for (const robot of data) {
    robot.p = { x: parseInt(robot.p[0]), y: parseInt(robot.p[1]) };
    robot.v = { x: parseInt(robot.v[0]), y: parseInt(robot.v[1]) };
  }

  for (var i = 0; i < 10000; i++) {
    const newData = movement(data, 1);
    plot(newData, i);
  }
}

function plot(robots, index) {
  let map = buildMap(width, height);
  for (const robot of robots) {
    const y = robot.p.y;
    const x = robot.p.x;
    map[y][x] = "*";
  }
  const drawMap = map.map((robot) => robot.join("")).join("\n");
  if(drawMap.includes("*******")){
    console.log("index", index + 1);
    console.log(drawMap);
  }
}

function run() {
  const data = parse2(testData);
  part2(structuredClone(data));
}

run()