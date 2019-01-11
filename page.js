let opened = false;
let selectedindex = -1;
let selectedElem;
let outputs;
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
  },
  { type: "keydown", propagate: true, target: document }
);
magicsearch.addEventListener(
  "keyup",
  e => {
    renderoutput();
    if (e.key == "ArrowDown") {
      selectedindex++;
    } else if (e.key == "ArrowUp") {
      selectedindex--;
    } else if (e.key == "Enter") {
      selectedElem.click();
      open();
    } else {
      selectedindex = 0;
    }
    psuedoselect();
  },
  true
);
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
}
function open() {
  opened = !opened;
  if (opened) {
    magicelem.style.display = "block";
    magicsearch.focus();
    selectedindex = -1;
  } else {
    magicelem.style.display = "none";
    magicsearch.value = "";
    renderoutput();
  }
}
let searchables = [
  {
    name: "",
    func: () => {}
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
    name: "dark theme",
    func() {
      console.log("night");
      function rgbToHsl(r, g, b) {
        (r /= 255), (g /= 255), (b /= 255);
        var max = Math.max(r, g, b),
          min = Math.min(r, g, b);
        var h,
          s,
          l = (max + min) / 2;

        if (max == min) {
          h = s = 0; // achromatic
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }

        return [h, s, l];
      }
      function backgroundColor(input) {
        let hsl = rgbToHsl(input[0], input[1], input[2]);
        return `hsl(${hsl[0]},${hsl[1] * 100}%,${100 - hsl[2] * 100}%)`;
      }
      let elems = document.getElementsByTagName("*");
      for (let i = 0; i < elems.length; i++) {
        let styles = window.getComputedStyle(elems[i]);
        console.log(
          styles.backgroundColor
            .split("(")[1]
            .slice(0, -1)
            .replace(/ /g, "")
            .split(",")
        );
        let newBackgroundColor = backgroundColor(
          styles.backgroundColor
            .split("(")[1]
            .slice(0, -1)
            .replace(/ /g, "")
            .split(",")
        );
        console.log(newBackgroundColor);
        elems[i].style.backgroundColor = newBackgroundColor;
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
  }
];
searchables.sort((a, b) => {
  return +(a.name > b.name) - 0.5;
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
    let ret = eval(`${q}`);
    // console.log(ret, q);
    searchables[0].name = ret.toString();
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
    if (superiorSearch(searchables[i].name, q)) {
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
    result.innerText = elem.name;
    result.addEventListener("click", e => {
      elem.func();
    });
    magic_output.appendChild(result);
  });
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
