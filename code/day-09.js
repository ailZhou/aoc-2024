window.onload = function () {
  var fileInput = document.getElementById("day09Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        rearrange(data);
        const data2 = parse2(reader.result.toString());
        rearrange2(data2);
      };

      reader.readAsText(file);
    } else {
      console.log("file not supported");
    }
  });
};

function parse(data) {
  let list = [];
  let index = 0;

  for (var i = 0; i < data.length; i++) {
    if (i % 2 == 0) {
      for (var j = 0; j < parseInt(data[i]); j++) {
        list.push(index.toString());
      }
      index++;
    } else {
      for (var j = 0; j < parseInt(data[i]); j++) {
        list.push(".");
      }
    }
  }

  return list;
}

function rearrange(data) {
  const updatedList = structuredClone(data);
  const totalEmptySlots = data.filter((item) => item === ".").length;

  for (var i = 0; i < totalEmptySlots; i++) {
    const indexOfEmpty = updatedList.findIndex((item) => item === ".");
    let num = ".";
    while (num === "." && indexOfEmpty > -1) {
      num = updatedList.pop();
    }
    if (indexOfEmpty > -1) {
      updatedList[indexOfEmpty] = num;
    }
  }

  console.log(sum(updatedList));
}

function buildString(list) {
  let stringList = "";
  for (var i = 0; i < list.length; i++) {
    stringList += list[i];
  }
}

function parse2(data) {
  let list = [];
  let index = 0;

  for (var i = 0; i < data.length; i++) {
    const chunk = [];
    if (i % 2 == 0) {
      for (var j = 0; j < parseInt(data[i]); j++) {
        chunk.push(index.toString());
      }
      index++;
    } else {
      for (var j = 0; j < parseInt(data[i]); j++) {
        chunk.push(".");
      }
    }
    list.push(chunk);
  }

  return list;
}

function rearrange2(data) {
  const copy = structuredClone(data);
  for (var i = 0; i < copy.length; i++) {
    if (copy[i].includes(".")) {
      const match = [...copy[i]];
      for (var j = copy.length - 1; j >= i; j--) {
        const remaining = match.filter((item) => item.includes(".")).length;
        if (remaining > 0) {
          if (remaining >= copy[j].length) {
            for (var k = 0; k < copy[j].length; k++) {
              const emptyIndex = match.findIndex((item) => item === ".");
              match.splice(emptyIndex, 1, copy[j][k]);
              copy[j][k] = "."
            }
          }
        }
      }
      copy[i] = match;
    }
  }

  console.log(sum(copy.flat()));
}

function sum(list) {
  let clean = list.filter((item) => item);
  let sum = 0;
  for (var i = 0; i < clean.length; i++) {
    if (clean[i] != ".") sum += parseInt(i) * parseInt(clean[i]);
  }
  return sum;
}
