window.onload = function () {
  var fileInput = document.getElementById("day10Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        const part1 = run(data,true);
        console.log("part 1",part1)

        const part2 = run(data,false);
        console.log("part 2",part2)
      };

      reader.readAsText(file);
    } else {
      console.log("file not supported");
    }
  });
};

const displacement = [
  // { x: -1, y: -1 },
  { x: 0, y: -1 },
  // { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  // { x: 1, y: 1 },
  { x: 0, y: 1 },
  // { x: -1, y: 1 },
];

function parse(data) {
  return data
    .replace(/\n/g, ",")
    .split(",")
    .map((item) => Array.from(item));
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

function run(data, unique) {
  const formatted = data
    .map((col, y) =>
      col.map((row, x) => {
        return {
          num: row,
          x,
          y,
        };
      })
    )
    .flat();

  const map = formatted.map((item) => {
    return { ...item, nodes: findNextPath(formatted, item) };
  });

  const trailHead = map.filter((item) => item.num == 0);
  let totalScores = 0;

  for(var i = 0; i < trailHead.length; i++){
    let nextSteps = [trailHead[i]];
    for(var j = 1; j <= 9; j++){
      const nodes = nextSteps.map((item) => item.nodes).flat().map((item) => map[item])
      nextSteps = (unique) ? nodes.filter(onlyUnique) : nodes;
    }
    totalScores += nextSteps.length;
  }
  return totalScores;
}

function findNextPath(data, node) {
  const nextPath = [];
  for (var i = 0; i < displacement.length; i++) {
    const newX = displacement[i].x + node.x;
    const newY = displacement[i].y + node.y;

    if (newX >= 0 && newY >= 0 && newX < data.length && newY < data.length) {
      const findIndex = data.findIndex((item) => item.x == newX && item.y == newY);
      if (findIndex > -1 && (parseInt(data[findIndex].num) - parseInt(node.num)) === 1) {
        nextPath.push(findIndex);
      }
    }
  }
  return nextPath;
}
