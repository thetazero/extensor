let opened = false;
let selectedindex = -1;
let selectedElem;
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
  }
}
let searchables = [
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
  }
];
let outputs;
function renderoutput() {
  let q = magicsearch.value;
  let found = 0;
  let i = 0;
  outputs = [];
  while (found < 5 && i < searchables.length) {
    if (searchables[i].name.indexOf(q) != -1) outputs.push(searchables[i]);
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
