window.onload = function () {
  var fileInput = document.getElementById("day13Input");

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
  return data.split("\n\n").map((info) => info.replace(/\n/g, "|").split("|"));
}

function format(data) {
  const format = data
    .map((item) => {
      return { button: item.split(":")[0], points: item.split(":")[1] };
    })
    .map((item) => item.points.trim().split(","));

  const X = {
    a: Number(format[0][0].match(/\d+/g)[0]),
    b: Number(format[1][0].match(/\d+/g)[0]),
    prize: Number(format[2][0].match(/\d+/g)[0]),
  };
  const Y = {
    a: Number(format[0][1].match(/\d+/g)[0]),
    b: Number(format[1][1].match(/\d+/g)[0]),
    prize: Number(format[2][1].match(/\d+/g)[0]),
  };
  return [X, Y];
}

function format2(data) {
  const format = data
    .map((item) => {
      return { button: item.split(":")[0], points: item.split(":")[1] };
    })
    .map((item) => item.points.trim().split(","));

  const X = {
    a: Number(format[0][0].match(/\d+/g)[0]),
    b: Number(format[1][0].match(/\d+/g)[0]),
    prize: Number(format[2][0].match(/\d+/g)[0]) + 10000000000000,
  };
  const Y = {
    a: Number(format[0][1].match(/\d+/g)[0]),
    b: Number(format[1][1].match(/\d+/g)[0]),
    prize: Number(format[2][1].match(/\d+/g)[0]) + 10000000000000,
  };
  return [X, Y];
}

function calculate(data) {
  const numerator = data[0].prize * data[1].b - data[1].prize * data[0].b;
  const denominator = data[0].a * data[1].b - data[1].a * data[0].b;
  const press_a = numerator / denominator;
  const press_b = (data[0].prize - data[0].a * press_a) / data[0].b;

  const checkA = (press_a * data[0].a + press_b * data[0].b)
  const checkB = (press_a * data[1].a + press_b * data[1].b)

  if(checkA == data[0].prize && checkB == data[1].prize){
    return { a: press_a, b: press_b };
  }

  return {};
}

const tokens = {
  a: 3,
  b: 1,
};

function part1(data) {
  const totals = data.map((info) => {
    const formatted = format(info);
    const pressed = calculate(formatted);
    return pressed.a * tokens.a + pressed.b * tokens.b;
  });
  const filtedTotal = totals.filter((total) => total % 1 == 0);
  const sumOfAll = filtedTotal.reduce((sum, value) => sum + value, 0);
  console.log(sumOfAll);
}

function part2(data) {
  const totals = data.map((info) => {
    const formatted = format2(info);
    const pressed = calculate(formatted);
    return pressed.a * tokens.a + pressed.b * tokens.b;
  });

  const filtedTotal = totals.filter((total) => total % 1 == 0);
  const sumOfAll = filtedTotal.reduce((sum, value) => sum + value, 0);
  console.log(sumOfAll);
}