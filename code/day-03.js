window.onload = function () {
  var fileInput = document.getElementById("day03Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const input = reader.result.toString();
        const filter = stripConditionalsDonts(input);
        const data = parse(filter.join());
        const total = mulAndSum(data);
        console.log(total);
      };

      reader.readAsText(file);
    } else {
      console.log("file not supported");
    }
  });
};

function containsOnlyDigits(str) {
  return /^\d+$/.test(str);
}

function stripConditionalsDonts(data) {
  return data
    .replace(/don't\(\)/g, "\n\ndon't()")
    .replace(/do\(\)/g, "\n\ndo()")
    .split("\n\n")
    .filter((stringList) => !stringList.includes("don't"));
}

function parse(data) {
  return data
    .replace(/mul/g, "\nmul")
    .split("\n")
    .map((stringlist) => {
      const index = stringlist.indexOf(")");
      return stringlist.slice(0, index + 1);
    })
    .filter(
      (stringlist) =>
        stringlist.includes("mul(") &&
        stringlist.includes(",") &&
        stringlist.includes(")")
    )
    .filter((stringlist) => {
      const paraEnd = stringlist.indexOf(")");
      const values = stringlist.slice(4, paraEnd).split(",");
      return (
        values.length === 2 &&
        containsOnlyDigits(values[0]) &&
        containsOnlyDigits(values[1])
      );
    });
}

function mulAndSum(data) {
  const mulValues = data.map((mul) => {
    const paraEnd = mul.indexOf(")");
    const nums = mul.slice(4, paraEnd).split(",");
    const value = parseInt(nums[0]) * parseInt(nums[1]);
    return value;
  });
  return mulValues.reduce((sum, num) => sum + num, 0);
}
