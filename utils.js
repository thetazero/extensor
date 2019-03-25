function shiftLetter(letter, num) {
  let trueNum = num % 50;
  return String.fromCharCode(letter.charCodeAt() + trueNum);
}
let tempConvert = {
  cf: e => {
    return (e * 9) / 5 + 32;
  },
  fc: e => {
    return ((e - 32) * 5) / 9;
  },
  ck: e => {
    return parseFloat(e) + 273.15;
  },
  kc: e => {
    return parseFloat(e) - 273.15;
  }
};
const elements = {
  h: {
    molarMass: 1.008,
    name: "hydrogen",
    number: 1
  },
  he: {
    molarMass: 4.003,
    name: "helium",
    number: 2
  },
  li: {
    molarMass: 6.94,
    name: "lithium",
    number: 3
  },
  be: {
    molarMass: 9.012,
    name: "beryllium",
    number: 4
  },
  b: {
    molarMass: 10.81,
    name: "boron",
    number: 5
  },
  c: {
    molarMass: 12.011,
    name: "carbon",
    number: 6
  },
  n: {
    molarMass: 14.007,
    name: "nitrogen",
    number: 7
  },
  o: {
    molarMass: 15.999,
    name: "oxygen",
    number: 8
  },
  f: {
    molarMass: 18.998,
    name: "fluorine",
    number: 9
  },
  ne: {
    molarMass: 20.18,
    name: "neon",
    number: 10
  },
  na: {
    molarMass: 22.99,
    name: "sodium",
    number: 11
  },
  mg: {
    molarMass: 24.305,
    name: "magnesium",
    number: 12
  },
  al: {
    molarMass: 26.982,
    name: "aluminium",
    number: 13
  },
  si: {
    molarMass: 28.085,
    name: "silicon",
    number: 14
  },
  p: {
    molarMass: 30.974,
    name: "phosphorus",
    number: 15
  },
  s: {
    molarMass: 32.06,
    name: "sulfur",
    number: 16
  },
  cl: {
    molarMass: 35.45,
    name: "chlorine",
    number: 17
  },
  ar: {
    molarMass: 39.948,
    name: "argon",
    number: 18
  },
  k: {
    molarMass: 39.098,
    name: "potasium",
    number: 19
  },
  ca: {
    molarMass: 40.078,
    name: "calcium",
    number: 20
  },
  //out of orders
  cu: {
    molarMass: 63.546,
    name: "copper",
    number: 29
  },
  fe: {
    molarMass: 55.845,
    name: "iron",
    number: 26
  },
  ag: {
    molarMass: 107.87,
    name: "silver",
    number: 47
  },
  rn: {
    molarMass: 222,
    name: "radon",
    number: 86
  }
};

function findBookmark(q, index) {
  let found = 0;
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].title.toLowerCase().includes(q.toLowerCase())) {
      // console.log(found, index)
      if (found == index) return bookmarks[i];
      found++;
    }
  }
}

function findElements(query) {
  let q = query.toLowerCase();
  let found = [];
  if (elements[q]) found.push(elements[q]);
  for (i in elements) {
    for (atr in elements[i]) {
      if (elements[i][atr].toString().includes(q)) {
        found.push(elements[i]);
        break;
      }
    }
  }
  return found;
}
