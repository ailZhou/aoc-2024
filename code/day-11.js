window.onload = function () {
  var fileInput = document.getElementById("day11Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        buildLookup(data);
        const blink = 75;
        const list = [
          data.map((item) => {
            return { count: 1, num: parseInt(item) };
          }),
        ];

        counter(list, blink);

        const last = list[list.length - 1];
        const total = last
          .map((item) => item.count)
          .reduce((sum, value) => sum + value, 0);
        console.log(total);
      };

      reader.readAsText(file);
    } else {
      console.log("file not supported");
    }
  });
};

function parse(data) {
  return data.split(" ");
}

function parseComma(data) {
  return data.split(",");
}

function getString(text, start, end) {
  let substr = "";
  for (var i = start; i < end; i++) {
    substr += text.charAt(i);
  }
  return substr;
}

function rules(digit) {
  if (digit == 0) {
    return [1];
  } else if (digit.toString().length % 2 === 0) {
    const formatted = digit.toString();
    const left = getString(formatted, 0, formatted.length / 2); //formatted.substring(0, formatted.length / 2);
    const right = getString(formatted, formatted.length / 2, formatted.length); //formatted.substring(formatted.length / 2, formatted.length);

    return [parseInt(left), parseInt(right)];
  } else {
    return [digit * 2024];
  }
}

function arrangment(data, blinks) {
  if (blinks === 0) {
    return data;
  }
  return arrangment(data.map((item) => rules(item)).flat(), blinks - 1);
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

const lookup = new Map();
const expandedList = new Map();
const expandedListTotal = new Map();

function buildLookup(data) {
  if (data.length === 0) {
    return data;
  }

  let nextKeys = [];
  for (var i = 0; i < data.length; i++) {
    const key = data[i];
    if (!lookup.has(data[i])) {
      let formattedList = rules(key);
      lookup.set(parseInt(key), formattedList);

      nextKeys.push(...formattedList.filter((key) => !lookup.has(key)));
    }
  }
  return buildLookup(nextKeys.filter(onlyUnique));
}

function counter(list, blink) {
  for (var i = 0; i < blink; i++) {
    const nextSet = list[list.length - 1]
      .map((item) => {
        return lookup.get(item.num).map((look) => {
          return { num: look, count: item.count };
        });
      })
      .flat();

    const row = [];
    for (var j = 0; j < nextSet.length; j++) {
      const key = nextSet[j].num;
      if (!row.find((item) => item.num === key)) {
        const total = nextSet
          .filter((item) => item.num == key)
          .reduce((sum, value) => sum + value.count, 0);
        row.push({ count: total, num: key });
      }
    }
    list.push(row);
  }
}

function countItems(data) {
  const row = [];
  for (var j = 0; j < data.length; j++) {
    const key = data[j];
    if (!row.find((item) => item.num === key)) {
      const total = data.filter((item) => item === key).length;
      row.push({ count: total, num: key });
    }
  }
  return row;
}