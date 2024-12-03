window.onload = function () {
  var fileInput = document.getElementById("day02Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        const state = analyzeReport(data, false);
        const stateWithError = analyzeReport(data, true);
        const total = state.filter((status) => status);
        const totalWithError = stateWithError.filter((status) => status);

        console.log(total.length);
        console.log("totalWithError", totalWithError.length);
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

function buildDiffList(levels) {
  const diffList = [];
  for (var i = 0; i < levels.length - 1; i++) {
    diffList.push(levels[i] - levels[i + 1]);
  }
  return diffList;
}

function checkDiff(list) {
  const isNegative = list.every((num) => num > 0 && num <= 3);
  const isPositive = list.every((num) => num < 0 && num >= -3);
  return isNegative || isPositive;
}

function analyzeReport(reports, allowError) {
  return reports.map((report) => {
    const levels = report.split(" ");

    const diffList = buildDiffList(levels);

    if (!allowError || checkDiff(diffList)) {
      return checkDiff(diffList);
    } else {
      for (var i = 0; i < levels.length; i++) {
        const newlevel = structuredClone(levels);
        newlevel.splice(i, 1);
        const state = checkDiff(buildDiffList(newlevel));
        if (state) return true;
      }
      return false;
    }
  });
}
