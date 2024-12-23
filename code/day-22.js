window.onload = function () {
  var fileInput = document.getElementById("day22Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        part1(data);
        part2(data);
      };

      reader.readAsText(file);
    } else {
      console.log("file not supported");
    }
  });
};

function parse(data) {
  return data.replace(/\n/g, ",").split(",");
}

function mixAndPrune(modified, number) {
  const mix = Number(BigInt(modified) ^ BigInt(number));
  const prune = mix % 16777216;
  return prune;
}

function calculateSecretNumber(number) {
  let multiply = mixAndPrune(number * 64, number);
  let divide = mixAndPrune(Math.trunc(multiply / 32), multiply);
  return mixAndPrune(divide * 2048, divide);
}

function generateSecretNumber(number, amount) {
  let secretNumber = number;
  for (var i = 0; i < amount; i++) {
    secretNumber = calculateSecretNumber(secretNumber);
  }
  return secretNumber;
}

const amount = 2001;
function part1(data) {
  const numbers = data.map((number) => generateSecretNumber(number, amount));
  const sum = numbers.reduce((sum, value) => sum + value, 0);
  console.log(sum);
}

function secretNumberList(number, amount) {
  let secretNumber = number;
  const list = [
    {
      num: number,
      price: parseInt(number.toString()[number.toString().length - 1]),
    },
  ];

  for (var i = 0; i < amount; i++) {
    secretNumber = calculateSecretNumber(secretNumber);
    const price = parseInt(
      secretNumber.toString()[secretNumber.toString().length - 1]
    );
    const changes = price - list[list.length - 1].price;
    list.push({ num: secretNumber, price, changes });
  }
  return list;
}

function part2(data) {
  const numbers = data.map((number) => secretNumberList(number, amount));
  const sequences = new Map();
  const values = [];
  for (var i = 0; i < numbers.length; i++) {
    const sets = [];
    const seenList = {};
    for (var j = 4; j < numbers[i].length; j++) {
      const num =
        numbers[i][j - 3].changes.toString() +
        numbers[i][j - 2].changes.toString() +
        numbers[i][j - 1].changes.toString() +
        numbers[i][j].changes.toString();

      if (!seenList[num]) {
        sets.push({
          price: numbers[i][j].price,
          set: num,
        });
        seenList[num] = true;
        if (sequences.has(num)) {
          sequences.set(num, sequences.get(num) + numbers[i][j].price);
        } else sequences.set(num, numbers[i][j].price);
      }
    }
    values.push(sets);
  }

  let highest = 0;
  for (const total of sequences) {
    highest = highest < total[1] ? total[1] : highest;
  }
}
