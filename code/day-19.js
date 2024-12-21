window.onload = function () {
  var fileInput = document.getElementById("day19Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        const towelMap = buildTowelMap(data.towels);
        part1(data.patterns, towelMap);
      };

      reader.readAsText(file);
    } else {
      console.log("file not supported");
    }
  });
};

function parse(data) {
  const splits = data.split("\n\n");
  const towels = splits[0].split(", ");
  const patterns = splits[1].split("\n");
  return { towels, patterns };
}

function buildTowelMap(towels) {
  const map = new Map();
  for (var i = 0; i < towels.length; i++) {
    const startColor = towels[i][0];
    if (map.has(startColor)) {
      const values = map.get(startColor);
      values.push(towels[i]);
      map.set(startColor, values);
    } else map.set(startColor, [towels[i]]);
  }
  return map;
}

function buildNodes(towelMap) {
  const sortedTowels = new Map();
  for (const towel of towelMap) {
    const colors = towel[1].sort();
    const organized = new Map();
    for (var i = 0; i < colors.length; i++) {
      if (organized.has(colors[i].length)) {
        const towels = organized.get(colors[i].length);
        towels.push(colors[i]);
        organized.set(colors[i].length, towels);
      } else {
        organized.set(colors[i].length, [colors[i]]);
      }
    }
    sortedTowels.set(towel[0], organized);
  }
  return sortedTowels;
}

function isPossible(pattern, towelMaps) {
  let openNodes = [];
  let closedNodes = [];
  const maxLength = pattern.length < 8 ? pattern.length : 8;
  const startMap = towelMaps.get(pattern[0]);
  let start = pattern.slice(0, maxLength);

  if (startMap == undefined) return false;

  while (start.length > 0) {
    const match = startMap.includes(start);
    if (match) {
      openNodes.push({ pattern: start, added: start });
    }
    start = start.slice(0, -1);
  }

  let counter = 0;
  while (openNodes.length > 0 && counter < 30) {
    let active = openNodes
      .sort((a, b) => a.pattern.length - b.pattern.length)
      .pop();

    closedNodes.push(active);
    if (active.pattern == pattern) {
      return true;
    }

    let remaining = pattern.replace(active.pattern, "");
    let nextLength = remaining.length < 8 ? remaining.length : 8;
    let nextSet = remaining.slice(0, nextLength);
    let colorMap = towelMaps.get(nextSet[0]);

    let child = [];
    while (nextSet.length > 0) {
      const match = colorMap.includes(nextSet);
      if (match) {
        child.push({ pattern: active.pattern + nextSet, added: nextSet });
      }
      nextSet = nextSet.slice(0, -1);
    }

    if (child.length > 0) {
      active.child = child;
      openNodes.push(...child);
    }
  }

  return false;
}

function part1(patterns, towelMap) {
  const total = patterns
    .map((pattern) => isPossible(pattern, towelMap))
    .filter((possible) => possible).length;
  console.log(total);
}

