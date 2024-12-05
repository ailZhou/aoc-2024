window.onload = function () {
  var fileInput = document.getElementById("day04Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        countXMAS(data);
        countMAS(data);
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
    .map((row) => Array.from(row));
}

function countXMAS(data) {
  //get all index of an X that is seen
  const indexOfX = data
    .map((row, r_index) =>
      row
        .map((letter, l_index) => {
          if (letter === "X") {
            return { x: r_index, letter, y: l_index };
          }
        })
        .filter((row) => row)
    )
    .flat();

  const searchResults = [];
  for (info of indexOfX) {
    //check top-left
    searchResults.push(
      data?.[info.x - 1]?.[info.y - 1] +
        data?.[info.x - 2]?.[info.y - 2] +
        data?.[info.x - 3]?.[info.y - 3]
    );
    //check top-center
    searchResults.push(
      data?.[info.x]?.[info.y - 1] +
        data?.[info.x]?.[info.y - 2] +
        data?.[info.x]?.[info.y - 3]
    );
    //check top-right
    searchResults.push(
      data?.[info.x + 1]?.[info.y - 1] +
        data?.[info.x + 2]?.[info.y - 2] +
        data?.[info.x + 3]?.[info.y - 3]
    );
    //check left
    searchResults.push(
      data?.[info.x - 1]?.[info.y] +
        data?.[info.x - 2]?.[info.y] +
        data?.[info.x - 3]?.[info.y]
    );
    //check right
    searchResults.push(
      data?.[info.x + 1]?.[info.y] +
        data?.[info.x + 2]?.[info.y] +
        data?.[info.x + 3]?.[info.y]
    );
    //check bottom-left
    searchResults.push(
      data?.[info.x - 1]?.[info.y + 1] +
        data?.[info.x - 2]?.[info.y + 2] +
        data?.[info.x - 3]?.[info.y + 3]
    );
    //check bottom-center
    searchResults.push(
      data?.[info.x]?.[info.y + 1] +
        data?.[info.x]?.[info.y + 2] +
        data?.[info.x]?.[info.y + 3]
    );
    //check bottom-right
    searchResults.push(
      data?.[info.x + 1]?.[info.y + 1] +
        data?.[info.x + 2]?.[info.y + 2] +
        data?.[info.x + 3]?.[info.y + 3]
    );
  }

  console.log("XMAS", searchResults.filter((word) => word === "MAS").length);
}

function countMAS(data) {
  //get all index of an X that is seen
  const indexOfX = data
    .map((row, r_index) =>
      row
        .map((letter, l_index) => {
          if (letter === "A") {
            return { x: r_index, letter, y: l_index };
          }
        })
        .filter((row) => row)
    )
    .flat();

  const searchResults = [];
  for (info of indexOfX) {
    searchResults.push([
      data?.[info.x - 1]?.[info.y - 1] + "A" + data?.[info.x + 1]?.[info.y + 1],
      data?.[info.x - 1]?.[info.y + 1] + "A" + data?.[info.x + 1]?.[info.y - 1],
    ]);
  }
  console.log(
    "MAS",
    searchResults.filter((wordList) =>
      wordList.every((word) => word === "MAS" || word === "SAM")
    ).length
  );
}
