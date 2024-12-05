// window.onload = function () {
//   var fileInput = document.getElementById("day06Input");

//   fileInput.addEventListener("change", function (e) {
//     var file = fileInput.files[0];
//     var textType = /text.*/;

//     if (file.type.match(textType)) {
//       var reader = new FileReader();

//       reader.onload = function (e) {
//         const data = parse(reader.result.toString());
//         console.log(data);
//       };

//       reader.readAsText(file);
//     } else {
//       console.log("file not supported");
//     }
//   });
// };

// function parse(data) {
//   return data.replace(/\n/g, ",").split(",");
// }

// function countXMAS() {}
