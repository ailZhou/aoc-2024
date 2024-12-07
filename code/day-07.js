window.onload = function () {
  var fileInput = document.getElementById("day07Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        calibrations(data, 2);
        calibrations(data, 3);
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
    .map((values) => {
      return {
        total: parseInt(values.split(": ")[0]),
        numbers: values.split(": ")[1],
      };
    });
}

function sum(num1, num2) {
  return num1 + num2;
}

function mul(num1, num2) {
  return num1 * num2;
}

function buildOperatorList(base, length) {
  const listLength = Math.pow(base, length);
  const zeroPad = (num, places) => String(num).padStart(places, "0");

  const list = [];
  for (var i = 0; i < listLength; i++) {
    const num = zeroPad(i.toString(base), length);
    list.push(num);
  }
  return list;
}

function calibrations(data, base) {
  const validTotals = [];

  for (var i = 0; i < data.length; i++) {
    const list = data[i].numbers.split(" ");
    const binary = buildOperatorList(base, list.length - 1);

    for (var j = 0; j < binary.length; j++) {
      let total = parseInt(list[0]);
      for (var k = 0; k < binary[j].length; k++) {
        if (binary[j][k] == 0) {
          total = total + parseInt(list[k + 1]);
        } else if (binary[j][k] == 1) {
          total = total * parseInt(list[k + 1]);
        } else if (binary[j][k] == 2) {
          total = parseInt(total.toString() + list[k + 1].toString());
        }
      }
      if (parseInt(total) === parseInt(data[i].total)) {
        validTotals.push(data[i].total);
        break;
      }
    }
  }

  const finalTotal = validTotals.reduce((sum, value) => sum + value, 0);
  console.log(finalTotal);
}
