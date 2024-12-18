window.onload = function () {
  var fileInput = document.getElementById("day17Input");

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
  const split = data.split("\n");
  const register = {
    a: split[0].split(":")[1],
    b: split[1].split(":")[1],
    c: split[2].split(":")[1],
  };
  const program = split[4].split(": ")[1].split(",");

  return { register, program };
}

let registerA;
let registerB;
let registerC;
let opcode;
let operand;
let jumped = false;
let output = "";

function combo_operand(operand) {
  switch (operand) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return registerA;
    case 5:
      return registerB;
    case 6:
      return registerC;
  }
  return null;
}

function adv() {
  const numerator = registerA;
  const denominator = Math.pow(2, combo_operand(operand));
  registerA = Math.trunc(numerator / denominator);
}

function bxl() {
  let a = registerB;
  let b = operand;
  registerB = Number(BigInt(a) ^ BigInt(b));
}

function bst() {
  registerB = combo_operand(operand) % 8;
}
function jnz() {
  if (registerA != 0) {
    jumped = true;
  }
}
function bxc() {
  let a = registerB;
  let b = registerC;
  registerB = Number(BigInt(a) ^ BigInt(b));
}
function out() {
  const value = combo_operand(operand) % 8;
  output = output + (value + ",");
}
function bdv() {
  const numerator = registerA;
  const denominator = Math.pow(2, combo_operand(operand));
  registerB = Math.trunc(numerator / denominator);
}
function cdv() {
  const numerator = registerA;
  const denominator = Math.pow(2, combo_operand(operand));
  registerC = Math.trunc(numerator / denominator);
}

function opcodeFunctions(opcode) {
  switch (opcode) {
    case 0:
      adv();
      break;
    case 1:
      bxl();
      break;
    case 2:
      bst();
      break;
    case 3:
      jnz();
      break;
    case 4:
      bxc();
      break;
    case 5:
      out();
      break;
    case 6:
      bdv();
      break;
    case 7:
      cdv();
      break;
  }
}

function part1(data) {
  const { register, program } = data;
  registerA = register.a;
  registerB = register.b;
  registerC = register.c;

  let instructionPointer = 0;
  while (instructionPointer < program.length) {
    const opcode = parseInt(program[instructionPointer]);
    operand = parseInt(program[instructionPointer + 1]);
    opcodeFunctions(opcode);

    if (jumped) {
      instructionPointer = operand;
      jumped = false;
    } else {
      instructionPointer += 2;
    }
  }
  console.log(output);
}

function reset(data) {
  registerA = data.a;
  registerB = data.b;
  registerC = data.c;
  output = "";
  jumped = false;
}

function part2(data) {
  const { register, program } = data;
  const copy = {
    a: register.a,
    b: register.b,
    c: register.c,
    program: program,
  };

  let indexMatch = 0;
  let result = "";
  let counter = 0;

  const programString = program.join(",");

  while (result.split(",").length < 17) {
    copy.a = counter;
    result = runComputer(copy, program);

    const sliced = (indexMatch < 15) ? program.slice(-(indexMatch + 1)).join(",") : program.join(",");

    if(result == programString){
      break;
    }
    else if (result == sliced) {
      indexMatch+=1;
      counter = counter * 8;
    }
    else
      counter = counter + 1;
  }

  console.log(counter, result);
}

function runComputer(data, program) {
  reset(data);
  let instructionPointer = 0;
  while (instructionPointer < program.length) {
    const opcode = parseInt(program[instructionPointer]);
    operand = parseInt(program[instructionPointer + 1]);
    opcodeFunctions(opcode);

    if (jumped) {
      instructionPointer = operand;
      jumped = false;
    } else {
      instructionPointer += 2;
    }
  }
  return output.substring(0, output.length - 1);
}
