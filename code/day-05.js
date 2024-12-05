window.onload = function () {
  var fileInput = document.getElementById("day05Input");

  fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const data = parse(reader.result.toString());
        const rules = data.filter((item) => item.includes("|"));
        const updates = data.filter((item) => !item.includes("|"));
        checkUpdates(rules, updates);
      };

      reader.readAsText(file);
    } else {
      console.log("file not supported");
    }
  });
};

function parse(data) {
  return data.replace(/\n/g, "]").split("]");
}

function checkUpdates(rules, updates) {
  const badOrders = [];
  const final = updates
    .map((update) => {
      const numList = update.split(",");
      var state = true;
      for (var i = 0; i < numList.length; i++) {
        const num = numList[i];
        const matchRules = rules.filter((rule) =>
          rule.split("|")[1].includes(num)
        );
        const comeBefore = matchRules.map((match) => match.split("|")[0]);
        const comeAfter = matchRules.map((match) => match.split("|")[1]);

        const isGood = numList.every((num, index) => {
          if (index < i) {
            if (comeAfter.includes(num)) return false;
          } else if (index > i) {
            if (comeBefore.includes(num)) return false;
          }
          return true;
        });
        if (!isGood) state = false;
      }
      if (!state) badOrders.push(numList);
      return state ? numList : undefined;
    })
    .filter((list) => list);

  const middleNum = final.map((nums) => nums[Math.floor(nums.length / 2)]);
  const total = middleNum.reduce((sum, value) => sum + parseInt(value), 0);
  console.log(total);

  orderIncorrectUpdates(rules, badOrders);
}

function orderIncorrectUpdates(rules, updates) {
  const final = updates.map((update) => {
    const fixedList = [update[0]];
    for (var i = 1; i < update.length; i++) {
      const nextNum = update[i];
      let newIndex = i;
      for (var j = fixedList.length - 1; j >= 0; j--) {
        const search = nextNum + "|" + fixedList[j];
        if (rules.filter((rule) => rule === search).length > 0) {
          newIndex = j;
        }
      }
      fixedList.splice(newIndex, 0, nextNum);
    }
    return fixedList;
  });
  const middleNum = final.map((nums) => nums[Math.floor(nums.length / 2)]);
  const total = middleNum.reduce((sum, value) => sum + parseInt(value), 0);
  console.log(total);
}
