window.onload = function () {
  var fileInput = document.getElementById("day12Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        const map = build(data);
        part1(map);
        part2(map);
      };

      reader.readAsText(file);
    } else {
      console.log("file not supported");
    }
  });
};

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

const plantDisplacement = [
  { x: 0, y: -1, dir: "up" },
  { x: -1, y: 0, dir: "left" },
  { x: 1, y: 0, dir: "right" },
  { x: 0, y: 1, dir: "down" },
];

function parse(data) {
  return data
    .replace(/\n/g, ",")
    .split(",")
    .map((item) => Array.from(item));
}

function buildNodes(data, node) {
  for (var i = 0; i < plantDisplacement.length; i++) {
    const newX = plantDisplacement[i].x + node.x;
    const newY = plantDisplacement[i].y + node.y;

    const findIndex = data.findIndex(
      (item) => item.x == newX && item.y == newY
    );

    if (data[findIndex] && data[findIndex].plant === node.plant) {
      node.nextPlant.push(data[findIndex]);
    }
  }
  return node;
}

function findRegion(node, traveled) {
  if (!traveled.includes(node.index)) {
    traveled.push(node.index);
  }
  const child = node.nextPlant.filter((plot) => !traveled.includes(plot.index));

  if (child.length === 0) {
    return traveled;
  } else {
    for (var i = 0; i < child.length; i++) {
      findRegion(child[i], traveled);
    }
    return traveled;
  }
}

function build(data) {
  const formatted = data
    .map((col, y) =>
      col.map((row, x) => {
        return {
          plant: row,
          x,
          y,
          nextPlant: [],
        };
      })
    )
    .flat()
    .map((data, index) => {
      return { ...data, index };
    });

  return formatted.map((item) => {
    return { ...buildNodes(formatted, item) };
  });
}

function buildRegionList(map) {
  const plantList = map.map((plot) => plot.plant).filter(onlyUnique);
  const regionsList = [];

  for (var i = 0; i < plantList.length; i++) {
    const plants = map.filter((plot) => plot.plant === plantList[i]);
    let remainingPlants = plants;

    while (remainingPlants.length > 0) {
      const region = findRegion(remainingPlants[0], []);
      regionsList.push({
        plant: plantList[i],
        region: region.map((index) => map[index]),
      });

      remainingPlants = remainingPlants.filter(
        (plant) => !region.includes(plant.index)
      );
    }
  }
  return regionsList;
}

function buildFences(plant) {
  const nextPlant = plant.nextPlant;
  const surroundings = plantDisplacement.map((point) => {
    return { x: point.x + plant.x, y: point.y + plant.y, dir: point.dir };
  });

  const fences = [];
  for (var j = 0; j < surroundings.length; j++) {
    const point = surroundings[j];
    if (!nextPlant.find((plant) => plant.x == point.x && plant.y == point.y))
      fences.push(point);
  }
  return fences;
}

function part1(map) {
  const regionsList = buildRegionList(map);
  const priceList = regionsList.map((plot) => {
    return {
      region: plot.region.length,
      price: plot.region
        .map((plot) => 4 - plot.nextPlant.length)
        .reduce((sum, value) => sum + value, 0),
    };
  });

  const total = priceList
    .map((plant) => plant.price * plant.region)
    .reduce((sum, value) => sum + value, 0);

  console.log(total);
}

function findEnds(point, matches, fences, displacement) {
  matches.push(point);

  const nextPoint = {
    x: point.x + displacement.x,
    y: point.y + displacement.y,
    dir: point.dir,
  };

  const fence = fences.find(
    (fence) =>
      fence.x == nextPoint.x &&
      fence.y == nextPoint.y &&
      fence.dir == nextPoint.dir
  );

  if (fence) {
    return findEnds(nextPoint, matches, fences, displacement);
  } else {
    return matches;
  }
}

function transverse(point, fences, sides) {
  if (fences.length === 0) {
    return sides;
  } else {
    const side = [];
    if (point.dir === "up" || point.dir === "down") {
      //up/down means going left or right
      const left = findEnds(point, [], fences, { x: -1, y: 0 });
      const right = findEnds(point, [], fences, { x: 1, y: 0 });
      side.push(...left, ...right);
    } else if (point.dir === "right" || point.dir === "left") {
      //right/left means going up or down
      const up = findEnds(point, [], fences, { x: 0, y: -1 });
      const down = findEnds(point, [], fences, { x: 0, y: 1 });
      side.push(...up, ...down);
    }
    //remove found fences from list
    fences = fences.filter(
      (fence) =>
        !side.find(
          (edge) =>
            edge.x == fence.x && edge.y == fence.y && edge.dir == fence.dir
        )
    );
    //add to sides
    sides.push(side);
    return transverse(fences[0], fences, sides);
  }
}

function part2(map) {
  const regionsList = buildRegionList(map);

  for (var i = 0; i < regionsList.length; i++) {
    //remove any plots that have plants around them
    const edges = regionsList[i].region.filter(
      (plot) => !(plot.nextPlant.length == 4)
    );

    const allFences = [];
    for (var j = 0; j < edges.length; j++) {
      const plant = edges[j];
      allFences.push(...buildFences(plant));
    }
    const sides = transverse(allFences[0], allFences, []);
    regionsList[i].price = sides.length;
  }

  const total = regionsList
    .map((plant) => plant.price * plant.region.length)
    .reduce((sum, value) => sum + value, 0);

  console.log(total);
}
