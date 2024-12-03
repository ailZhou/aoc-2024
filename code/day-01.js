window.onload = function () {
  var fileInput = document.getElementById("day01Input");
  var fileDisplayArea = document.getElementById("fileDisplayArea");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        const listLeft = data.filter((_data, index) => index % 2 === 1);
        const listRight = data.filter((_data, index) => index % 2 === 0);

        console.log("distance", distance(listLeft, listRight));
        console.log("similarity", similarity(listLeft, listRight));
      };

      reader.readAsText(file);
    } else {
      fileDisplayArea.innerText = "File not supported!";
    }
  });
};

function parse(data) {
  const newData = data.replaceAll("   ", ", ").replace(/\n/g, ", ");
  return newData.split(", ");
}

function distance(listLeft, listRight) {
  listLeft.sort();
  listRight.sort();

  const distanceList = listLeft.map((num, index) =>
    Math.abs(num - listRight[index])
  );
  return distanceList.reduce((sum, num) => sum + num, 0);
}

function similarity(listLeft, listRight) {
  const similiarityList = listLeft.map(
    (num) => num * listRight.filter((rightNums) => rightNums === num).length
  );
  return similiarityList.reduce((sum, num) => sum + num, 0);
}
