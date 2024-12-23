window.onload = function () {
  var fileInput = document.getElementById("day23Input");

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
  return data.split("\n").map((item, index) => {
    return { index, link: item, computer: item.split("-").sort() };
  });
}

function part1(data) {
  const listOfLinks = [];

  for (var i = 0; i < data.length; i++) {
    const { computer } = data[i];
    const unique = data.filter((item) => item.computer != computer);
    const matches = unique.filter(
      (item) =>
        item.link.includes(computer[0]) || item.link.includes(computer[1])
    );

    const links = {};
    for (var j = 0; j < matches.length; j++) {
      const possibleLink = matches[j].computer.find(
        (comp) => comp != computer[0] && comp != computer[1]
      );
      links[possibleLink] = links[possibleLink] ? links[possibleLink] + 1 : 1;
    }
    for (const [key, value] of Object.entries(links)) {
      if (value > 1) {
        const link = [...computer, key].sort().toString();
        if (!listOfLinks.includes(link)) listOfLinks.push(link);
      }
    }
  }

  const listOfT = listOfLinks.filter((item) =>
    item.split(",").find((comp) => comp[0] == "t")
  );
  console.log("total: ", listOfT.length);
}

function part2(data) {
  const nodesList = [];
  let node = data.pop().computer;

  while (data.length > 0) {
    const matches = {};
    for (var i = 0; i < node.length; i++) {
      const possibleLinks = data
        .filter((item) => item.computer.includes(node[i]))
        .map((links) => {
          return {
            index: links.index,
            comp: links.computer.filter((computer) => computer != node[i])[0],
          };
        });

      for (const links of possibleLinks) {
        if (matches[links.comp]) {
          matches[links.comp].push(links.index);
        } else {
          matches[links.comp] = [links.index];
        }
      }
    }

    var noMatch = true;
    for (const [key, value] of Object.entries(matches)) {
      if (value.length == node.length) {
        node.push(key);

        for (var i = 0; i < value.length; i++) {
          const removeIndex = data.findIndex((item) => item.index == value[i]);
          data.splice(removeIndex, 1);
        }

        noMatch = false;
        break;
      }
    }
    if (noMatch) {
      nodesList.push(node);
      node = data.pop().computer;
    }
  }

  let longest = [];

  for (var i = 0; i < nodesList.length; i++) {
    longest = nodesList[i].length > longest.length ? nodesList[i] : longest;
  }
  console.log(longest.sort().join());
}

run();
