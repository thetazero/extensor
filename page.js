let opened = false;
let selectedindex = -1;
let selectedElem;
let outputs;
let mode = 0;
let isProcessor = true;
//initializing elements
const magicelem = elemMaker("div", {
  id: "magic-elem",
  classList: "magicthingy"
});
document.body.appendChild(magicelem);
const magicsearch = elemMaker("input", {
  type: "text",
  classList: "browser-default magicthingy"
});
magicelem.appendChild(magicsearch);
magic_output = elemMaker("div", {
  classList: "searchbox magicthingy"
});
magicelem.appendChild(magic_output);

shortcut.add(
  "Meta+J",
  () => {
    open();
  }, {
    type: "keydown",
    propagate: true,
    target: document
  }
);
magicsearch.addEventListener(
  "keyup",
  e => {
    renderoutput();
    if (e.key == "Enter") {
      if (window.getComputedStyle(selectedElem).display == "block")
        selectedElem.click();
    }
  },
  true
);
magicsearch.addEventListener("keydown", e => {
  if (e.key == "ArrowDown") {
    selectedindex++;
    e.preventDefault();
  } else if (e.key == "ArrowUp") {
    selectedindex--;
    e.preventDefault();
  }
  renderoutput();
});

function psuedoselect() {
  let terms = document.getElementsByClassName("searchterm");
  if (selectedindex < 0) selectedindex = 0;
  if (selectedindex > terms.length - 1) selectedindex = terms.length - 1;
  for (let i = 0; i < terms.length; i++) {
    if (selectedindex == i) {
      terms[i].classList.add("psuedo-selected");
      selectedElem = terms[i];
    } else terms[i].classList.remove("psuedo-selected");
  }
  // console.log(selectedElem);
}

function open(openIt) {
  mode = 0;
  opened = openIt == undefined ? !opened : openIt;
  if (opened) {
    magicelem.style.display = "block";
    magicsearch.focus();
    selectedindex = -1;
  } else {
    magicelem.style.display = "none";
    magicsearch.value = "";
    renderoutput();
  }
  console.log(!(openIt == undefined), openIt);
  if (openIt == undefined)
    channel.postMessage({
      type: "open",
      val: opened
    });
}
let searchables = [{
    name: "",
    func: q => {
      let ret = eval(`${q}`);
      return ret.toString();
    }
  },
  {
    name: "alert",
    func() {
      alert("hi");
    }
  },
  {
    name: "comic sans",
    func() {
      var x = document.styleSheets[document.styleSheets.length - 1];
      x.insertRule(
        '* { font-family: "Comic Sans MS" !important; }',
        x.cssRules.length
      );
    }
  },
  {
    name: "borderline 50% radius",
    func() {
      var x = document.getElementsByTagName("*");
      for (var i = 0; i < x.length; i++) {
        if (!x[i].classList.contains("magicthingy"))
          x[i].style.borderRadius = "50%";
      }
    }
  },
  {
    name: "invert",
    func() {
      document.getElementsByTagName("body")[0].style.filter = "invert(100%)";
    }
  },
  {
    name: "editwebsite",
    func() {
      if (document.body.contentEditable != "true") {
        document.body.contentEditable = "true";
        document.designMode = "on";
      } else {
        document.body.contentEditable = "false";
        document.designMode = "off";
      }
    }
  },
  {
    name: "toggle blur",
    func() {
      if (document.getElementById("magic-blur-style"))
        deleteElement("magic-blur-style");
      else
        document.head.appendChild(
          elemMaker("style", {
            id: "magic-blur-style",
            innerText: `body > *:not(#magic-elem) {
              filter: blur(20px);
            }`
          })
        );
    }
  },
  {
    name: "molar mass",
    func(q) {
      let tokens = [];
      let curToken = "";

      function canToken(token) {
        if (isNumber(token)) return true;
        if (elements[token]) return true;
        return false;
      }

      function isNumber(str) {
        return /^\d+$/.test(str);
      }
      for (let i = 0; i < q.length; i++) {
        curToken += q[i];
        if (!canToken(curToken + q[i + 1])) {
          if (
            !(curToken == ")") &&
            !(curToken == "(") &&
            !elements[curToken] &&
            !isNumber(curToken)
          )
            return null;
          tokens.push(curToken);
          curToken = "";
        }
      }
      let pTokens = [];
      let opened = true;
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] == "(") opened = true;
        else if (tokens[i] == ")") opened = false;
        else {
          pTokens.push(tokens[i]);
          if (!isNumber(tokens[i + 1]) && !isNumber(tokens[i])) {
            pTokens.push(1);
          }
        }
      }
      let molarMass = 0;
      for (let i = 0; i < pTokens.length; i += 2) {
        molarMass += elements[pTokens[i]].molarMass * pTokens[i + 1];
      }
      return Math.round(molarMass * 1000) / 1000;
    },
    isProcessor
  },
  {
    name: "js mode",
    func() {
      mode = 0;
    },
    isProcessor
  },
  {
    name: "spoiler discord",
    func(thing) {
      return thing
        .split("")
        .map(a => `||${a}||`)
        .join("");
    },
    isProcessor
  },
  {
    name: "fibonaci encoder",
    func(q) {
      let ret = "";
      let small = 1;
      let big = 1;
      for (let i = 0; i < q.length; i++) {
        [small, big] = [big, small + big];
        ret += shiftLetter(q[i], small);
      }
      return ret;
    },
    isProcessor
  },
  {
    name: "fibonaci decoder",
    func(q) {
      let ret = "";
      let small = 1;
      let big = 1;
      for (let i = 0; i < q.length; i++) {
        [small, big] = [big, small + big];
        ret += shiftLetter(q[i], -small);
      }
      return ret;
    },
    isProcessor
  },
  {
    name: "scream",
    func(q) {
      return q
        .split("")
        .map(e => {
          return Math.random() > 0.5 ? e : e.toUpperCase();
        })
        .join("");
    },
    isProcessor
  },
  {
    name: "to lower case",
    func(q) {
      return q.toLowerCase();
    },
    isProcessor
  },
  {
    name(q) {
      return `https://google.com/search?q=${q}`;
    },
    func(q) {
      window.location = `https://google.com/search?q=${q}`;
    }
  }, {
    name(q) {
      for (let i = 0; i < bookmarks.length; i++) {
        if (superiorSearch((bookmarks[i].title.toLowerCase()), q)) return bookmarks[i].title
      }
    },
    func(q) {
      for (let i = 0; i < bookmarks.length; i++) {
        if (superiorSearch((bookmarks[i].title.toLowerCase()), q)) window.location = bookmarks[i].url
      }
    }
  }
];
searchables.sort((a, b) => {
  return +(a.name > b.name) - 0.5;
});
searchables.map((e, i) => {
  searchables[i].id = i;
});

function superiorSearch(searched, query) {
  let queryIrl = query.split("");
  for (let i = 0; i < searched.length && queryIrl.length > 0; i++) {
    if (searched[i] == queryIrl[0]) {
      queryIrl.shift();
    }
  }
  return queryIrl.length == 0;
}

function renderoutput() {
  let q = magicsearch.value;
  try {
    // console.log(mode);
    searchables[0].name = searchables[mode].func(q);
  } catch (e) {
    searchables[0].name = "";
  }
  let found = 0;
  let i = 1;
  outputs = [];
  if (searchables[0].name) {
    found++;
    outputs.push(searchables[0]);
  }
  while (found < 5 && i < searchables.length) {
    if (
      superiorSearch(searchables[i].name, q) ||
      (typeof searchables[i].name == "function" && searchables[i].name(q))
    ) {
      outputs.push(searchables[i]);
      found++;
    }
    i++;
  }
  magic_output.innerHTML = "";
  outputs.forEach(elem => {
    let result = document.createElement("div");
    result.classList.add("searchterm");
    result.classList.add("magicthingy");
    console.log(typeof elem.name);
    result.innerText =
      typeof elem.name == "function" ? elem.name(q) : elem.name;
    if (elem.id == 0) {
      result.addEventListener("click", e => {
        console.log(elem, mode);
        if (searchables[mode].custom) searchables[mode].custom(q);
        else copyToClipBoard(result.innerText);
        renderoutput();
      });
    } else
      result.addEventListener("click", e => {
        console.log(elem);
        if (elem.isProcessor) {
          mode = elem.id;
          magicsearch.value = null;
        } else open();
        elem.func(q);
      });
    magic_output.appendChild(result);
  });
  selectedElem = null;
  psuedoselect();
}

function copyToClipBoard(text) {
  const el = elemMaker("textarea", {
    value: text
  });
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  magicsearch.focus();
  magicsearch.value = null;
}

function elemMaker(elem, config) {
  let element = document.createElement(elem);
  for (key in config) element[key] = config[key];
  return element;
}

function deleteElement(elementId) {
  let element = document.getElementById(elementId);
  element.parentNode.removeChild(element);
}
renderoutput();
//utils for use
function shiftLetter(letter, num) {
  let trueNum = num % 50;
  return String.fromCharCode(letter.charCodeAt() + trueNum);
}
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
  }
};