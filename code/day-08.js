window.onload = function () {
  var fileInput = document.getElementById("day08Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        const points = getAntennaPoints(data);
        const total1 = part1(structuredClone(data), points);
        const total2 = part2(structuredClone(data), points);
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

function getAntennaPoints(data) {
  return data
    .map((arr, i) =>
      arr
        .map((item, j) => {
          if (item != ".")
            return { symbol: item, x: parseInt(j), y: parseInt(i) };
        })
        .filter((item) => item)
    )
    .flat();
}

function generatePointsMap(points) {
  const pointsMap = new Map();
  for (const point of points) {
    if (!pointsMap.has(point.symbol)) {
      pointsMap.set(
        point.symbol,
        points.filter((item) => point.symbol === item.symbol)
      );
    }
  }
  return pointsMap;
}

function generateAntinodes(pointsMap, loop) {
  const antinodes = [];
  for (const [_symbol, points] of pointsMap) {
    for (var i = 0; i < points.length; i++) {
      for (var j = i + 1; j < points.length; j++) {
        const distance = {
          x: points[i].x - points[j].x,
          y: points[i].y - points[j].y,
        };
        for (var k = 1; k <= loop; k++) {
          const antiNode1 = {
            x: points[i].x + distance.x * k,
            y: points[i].y + distance.y * k,
          };
          const antiNode2 = {
            x: points[j].x - distance.x * k,
            y: points[j].y - distance.y * k,
          };
          antinodes.push(antiNode1, antiNode2);
        }
      }
    }
  }

  return antinodes;
}

function count(map, antinodes, width, height) {
  let total = 0;
  for (const nodes of antinodes) {
    if (nodes.y > -1 && nodes.y < width && nodes.x > -1 && nodes.x < height) {
      if (map[nodes.y][nodes.x] != "#") total += 1;
      map[nodes.y][nodes.x] = "#";
    }
  }

  return total;
}

function count2(map, antinodes, width, height) {
  let total = 0;
  for (const nodes of antinodes) {
    if (nodes.y > -1 && nodes.y < width && nodes.x > -1 && nodes.x < height) {
      if (map[nodes.y][nodes.x] === ".") {
        total += 1;
        map[nodes.y][nodes.x] = "#";
      }
    }
  }

  return total;
}

function part1(map, points) {
  const height = map.length;
  const width = map[0].length;

  const pointsMap = generatePointsMap(points);
  const antinodes = generateAntinodes(pointsMap, 1);
  const total = count(map, antinodes, width, height);

  console.log(total);
  console.log(map);
}

function part2(map, points) {
  const height = map.length;
  const width = map[0].length;

  const pointsMap = generatePointsMap(points);
  const antinodes = generateAntinodes(pointsMap, width);
  const total = count2(map, antinodes, width, height);

  console.log(total + points.length);
  console.log(map);
}
