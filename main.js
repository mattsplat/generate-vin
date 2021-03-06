getVIN = function (v) {
  let vin = generateVin();
  copyTextToClipboard(vin);
  return vin;
};

try {
  chrome.contextMenus.create({
    title: "Generate VIN",
    contexts: ["all"],
    onclick: getVIN,
  });
} catch {}

var vinDigitPositionMultiplier = [
  8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2,
];
var vinDigitValues = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    P: 7,
    R: 9,
    S: 2,
    T: 3,
    U: 4,
    V: 5,
    W: 6,
    X: 7,
    Y: 8,
    Z: 9,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    0: 0,
  },

  vinDigitValueKeys = Object.keys(vinDigitValues);

function getCheckSum(vin) {
  var checkSumTotal = 0,
    remainder;

  if (vin.length < 17) {
    throw new Error("Invalid VIN Length: " + vin.length);
  }

  for (i = 0; i < vin.length; i++) {
    let char = vin[i];
    if (vinDigitValues[char] !== undefined) {
      checkSumTotal += vinDigitValues[char] * vinDigitPositionMultiplier[i];
    } else {
      throw new Error("Illegal Character: " + char);
    }
  }

  remainder = checkSumTotal % 11;

  if (remainder === 10) {
    return "X";
  }

  return remainder;
}

function generateVin() {
  // const prefix = randomElement(prefixKeys);
  const prefix_full = prefixes[Math.floor(Math.random()*prefixes.length)];
  const prefix = prefix_full.slice(0,8);
  const post = prefix_full.slice(8)


  let chars = "";
  for (let x = 0; x < 2; x++) {
    chars += randomElement(vinDigitValueKeys);
  }
  for (let x = 0; x < 4; x++) {
    chars += Math.floor(Math.random() * 10);
  }

  let vinPart = prefix + randomElement(vinDigitValueKeys) + post + chars;

  var check = getCheckSum(vinPart);

  return vinPart.substring(0, 8) + check + vinPart.substring(9, 17);
}

function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to.
  var copyFrom = document.createElement("textarea");

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child.
  //"execCommand()" only works when there exists selected text, and the text is inside
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand("copy");

  //(Optional) De-select the text using blur().
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}

function randomElement(obj) {
  // if(typeof items === 'object') {
  //   let key = Object.keys(items)[Math.floor(Math.random()*items.length)];
  // } else {
  //   let key = Math.floor(Math.random()*items.length);
  // }
  // return items[key];
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
}