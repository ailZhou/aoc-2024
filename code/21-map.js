function parse(data) {
  return data.split("\n").map((item) => {
    const split = item.split(": ");
    return { index: split[0], pad: split[1] };
  });
}

function run() {
  const data = parse(
    "029A: <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A\n980A: <v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A\n179A: <v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A\n456A: <v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A\n379A: <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A"
  );
  part1(data);
}

const dirPad = [
  ["", "^", "A"],
  ["<", "v", ">"],
];

function emptySpot(gap, pos, nextPos) {
  const next = { x: pos.x + nextPos.x, y: pos.y + nextPos.y };
  return gap.x == next.x && gap.y == next.y;
}

function dirToNum(code) {
  const robotPos = { x: 2, y: 0 };
  const moves = new Map();

  let start = dirPad[robotPos.y][robotPos.x];
  let codeList = [];
  for (var i = 0; i < code.length; i++) {
    const currCode = code[i];
    codeList.push(currCode);

    if (currCode == "<") {
      robotPos.x -= 1;
    } else if (currCode == ">") {
      robotPos.x += 1;
    } else if (currCode == "v") {
      robotPos.y += 1;
    } else if (currCode == "^") {
      robotPos.y -= 1;
    } else if (currCode == "A") {
      const arrow = dirPad[robotPos.y][robotPos.x];
      moves.set(start + arrow, codeList);
      start = arrow;
      codeList = [];
    }
  }
  return moves;
}

function lookup(dir, dirMap) {
  let path = "";
  for (var i = 0; i < dir.length; i++) {
    const start = i == 0 ? "A" : dir[i - 1];
    const index = start + dir[i];
    if (!dirMap.has(index)) {
      console.log("missing", index);
    } else path += dirMap.get(index).join("");
  }

  return path;
}

const numPad = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["", "0", "A"],
];

function numMap() {
  const map = new Map();
  map.set("A0", ["<", "A"]);
  map.set("02", ["^", "A"]);
  map.set("29", [">", "^", "^", "A"]);
  map.set("9A", ["v", "v", "v", "A"]);
  map.set("A5", ["<", "^", "^", "A"]);
  map.set("54", ["<", "A"]);
  map.set("40", [">", "v", "v", "A"]);
  map.set("0A", [">", "A"]);

  map.set("A8", ["<", "^", "^", "^", "A"]);
  map.set("83", ["v", "v", ">", "A"]);
  map.set("39", ["^", "^", "A"]);

  map.set("A6", ["^", "^", "A"]);
  map.set("68", ["<", "^", "A"]);
  map.set("82", ["v", "v", "A"]);
  map.set("2A", ["v", ">", "A"]);

  map.set("26", ["^", ">", "A"]);
  map.set("6A", ["v", "v", "A"]);
  map.set("A9", ["^", "^", "^", "A"]);
  map.set("97", ["<", "<", "A"]);
  map.set("74", ["v", "A"]);
  map.set("4A", [">", ">", "v", "v", "A"]);

  return map;
}

function part1(data) {
  let bigMap = new Map();
  const numPad2 = numMap();

  for (var i = 0; i < data.length; i++) {
    const dirMap = dirToNum(data[i].pad);
    for (const pairs of dirMap) {
      if (!bigMap.has(pairs[0])) {
        bigMap.set(pairs[0], pairs[1]);
      }
    }
  }

  bigMap.set("^^", ["A"]);
  bigMap.set("vv", ["A"]);
  bigMap.set("^<", ["v", ">", "A"]);
  bigMap.set("v>", [">", "A"]);
  bigMap.set(">v", ["<", "A"]);
  bigMap.set("A<", ["v", "<", "<", "A"]);
  bigMap.set("^>", ["v", ">", "A"]);

  const codes = ["540A", "839A", "682A", "826A", "974A"];
  const totals = [];

  for (var i = 0; i < codes.length; i++) {
    const numkeypad = lookup(codes[i], numPad2);

    let robotKeyPad = numkeypad;
    for (var j = 0; j < 25; j++) {
      robotKeyPad = lookup(robotKeyPad, bigMap);
      console.log(robotKeyPad);
    }

    const lastPad = lookup(robotKeyPad, bigMap);
    console.log(lastPad.length);
    const num = parseInt(codes[i].replace("A", ""));
    totals.push(num * lastPad.length);
    break;
  }

  const sum = totals.reduce((sum, value) => sum + value, 0);
  console.log(sum);
}

run();
