let opened = false;
let selectedindex = -1;
let selectedElem;
let outputs;
let mode = 0;
let isProcessor = true;
//initializing elements
const magicelem = elemMaker('div', {
  id: 'magic-elem',
  classList: 'magicthingy'
});
document.body.appendChild(magicelem);
const magicsearch = elemMaker('input', {
  type: 'text',
  classList: 'browser-default magicthingy'
});
magicelem.appendChild(magicsearch);
magic_output = elemMaker('div', {
  classList: 'searchbox magicthingy'
});
magicelem.appendChild(magic_output);

shortcut.add(
  'Meta+J',
  () => {
    open();
  }, {
    type: 'keydown',
    propagate: true,
    target: document
  }
);
magicsearch.addEventListener(
  'keyup',
  e => {
    renderoutput();
    if (e.key == 'Enter') {
      if (window.getComputedStyle(selectedElem).display == 'block')
        selectedElem.click();
    }
  },
  true
);
magicsearch.addEventListener('keydown', e => {
  if (e.key == 'ArrowDown') {
    selectedindex++;
    e.preventDefault();
  } else if (e.key == 'ArrowUp') {
    selectedindex--;
    e.preventDefault();
  }
  renderoutput();
});

function psuedoselect() {
  let terms = document.getElementsByClassName('searchterm');
  if (selectedindex < 0) selectedindex = 0;
  if (selectedindex > terms.length - 1) selectedindex = terms.length - 1;
  for (let i = 0; i < terms.length; i++) {
    if (selectedindex == i) {
      terms[i].classList.add('psuedo-selected');
      selectedElem = terms[i];
    } else terms[i].classList.remove('psuedo-selected');
  }
  // console.log(selectedElem);
}

function open(openIt) {
  mode = 0;
  opened = openIt == undefined ? !opened : openIt;
  if (opened) {
    magicelem.style.display = 'block';
    magicsearch.focus();
    selectedindex = -1;
  } else {
    magicelem.style.display = 'none';
    magicsearch.value = '';
    renderoutput();
  }
  console.log(!(openIt == undefined), openIt);
  if (openIt == undefined)
    channel.postMessage({
      type: 'open',
      val: opened
    });
}
let searchables = [{
  name: '',
  func: q => {
    let ret = eval(`${q}`);
    return ret.toString();
  }
},
{
  name: 'alert',
  func() {
    alert('hi');
  }
},
{
  name: 'comic sans',
  func() {
    var x = document.styleSheets[document.styleSheets.length - 1];
    x.insertRule(
      '* { font-family: "Comic Sans MS" !important; }',
      x.cssRules.length
    );
  }
},
{
  name: 'borderline 50% radius',
  func() {
    var x = document.getElementsByTagName('*');
    for (var i = 0; i < x.length; i++) {
      if (!x[i].classList.contains('magicthingy'))
        x[i].style.borderRadius = '50%';
    }
  }
},
{
  name: 'invert',
  func() {
    document.getElementsByTagName('body')[0].style.filter = 'invert(100%)';
  }
},
{
  name: 'editwebsite',
  func() {
    if (document.body.contentEditable != 'true') {
      document.body.contentEditable = 'true';
      document.designMode = 'on';
    } else {
      document.body.contentEditable = 'false';
      document.designMode = 'off';
    }
  }
},
{
  name: 'toggle blur',
  func() {
    if (document.getElementById('magic-blur-style'))
      deleteElement('magic-blur-style');
    else
      document.head.appendChild(
        elemMaker('style', {
          id: 'magic-blur-style',
          innerText: `body > *:not(#magic-elem) {
              filter: blur(20px);
            }`
        })
      );
  }
},
{
  name: 'molar mass',
  func(q) {
    let tokens = [];
    let curToken = '';

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
          !(curToken == ')') &&
          !(curToken == '(') &&
          !elements[curToken] &&
          !isNumber(curToken)
        )
          return null;
        tokens.push(curToken);
        curToken = '';
      }
    }
    let pTokens = [];
    let opened = true;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] == '(') opened = true;
      else if (tokens[i] == ')') opened = false;
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
  name: 'js mode',
  func() {
    mode = 0;
  },
  isProcessor
},
{
  name: 'spoiler discord',
  func(thing) {
    return thing
      .split('')
      .map(a => `||${a}||`)
      .join('');
  },
  isProcessor
},
{
  name: 'fibonaci encoder',
  func(q) {
    let ret = '';
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
  name: 'fibonaci decoder',
  func(q) {
    let ret = '';
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
  name: 'scream',
  func(q) {
    return q
      .split('')
      .map(e => {
        return Math.random() > 0.5 ? e : e.toUpperCase();
      })
      .join('');
  },
  isProcessor
},
{
  name: 'to lower case',
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
},
{
  name(q) {
    let res = findBookmark(q, 0);
    return res ? res.title : null;
  },
  func(q) {
    window.location = findBookmark(q, 0).url;
  }
},
{
  name(q) {
    let res = findBookmark(q, 1);
    return res ? res.title : null;
  },
  func(q) {
    window.location = findBookmark(q, 1).url;
  }
},
{
  name(q) {
    let res = findBookmark(q, 2);
    return res ? res.title : null;
  },
  func(q) {
    window.location = findBookmark(q, 2).url;
  }
},
{
  name: 'new tab',
  func() {
    chrome.runtime.sendMessage({
      key: 'newtab'
    });
  }
},
{
  name(q) {
    try {
      x = tempConvert[q[0] + q[q.length - 1]](q.slice(1, q.length - 1));
      return `${x}${q[q.length - 1]} from ${q[0]}`;
    } catch (e) {
      return false;
    }
  },
  func(q) {
    x = tempConvert[q[0] + q[q.length - 1]](q.slice(1, q.length - 1));
    copyToClipBoard(x);
    open();
  }
},
{
  name: 'kill sticky',
  func() {
    let elements = document.querySelectorAll('body *');
    for (let i = 0; i < elements.length; i++) {
      if (getComputedStyle(elements[i]).position === 'fixed') {
        elements[i].parentNode.removeChild(elements[i]);
      }
    }
  }
},
{
  name(query) {
    let q = query.split('.')[0]
    let q2 = query.split('.')[1]
    let found = findElements(q)
    if (!found) return false;
    if (found[0][q2]) {
      return found[0][q2]
    } else return JSON.stringify(found[0])
  },
  func(query) {
    let q = query.split('.')[0]
    let q2 = query.split('.')[1]
    let found = findElements(q)
    if (found[0][q2]) copyToClipBoard(found[0][q2]);
    else copyToClipBoard(found[0]);
    open();
  }
},
{
  name: 'wëird letters',
  func(thing) {
    let ret = '';
    let converter = {
      a: 'àáâäãåā',
      c: 'çćč',
      e: 'èéêëēėę',
      i: 'îïíīįì',
      l: 'ł',
      n: 'ñń',
      o: 'ôöòóøōõ',
      s: 'śš',
      u: 'ûüùúū',
      y: 'ÿ',
      z: 'žźż'
    }
    for (let i = 0; i < thing.length; i++) {
      let tempkey = converter[thing[i].toLowerCase()]
      if (tempkey) {
        if (thing[i].toLowerCase() == thing[i])
          ret += tempkey[Math.floor(Math.random() * tempkey.length)];
        else ret += tempkey[Math.floor(Math.random() * tempkey.length)].toUpperCase();
      } else ret += thing[i];
    }
    return ret;
  },
  isProcessor
}, {
  name: 'keymash',
  func(q) {
    let lenreal = parseInt(q)
    if (!lenreal) lenreal = Math.floor(Math.random() * 10) + 10
    let letters = 'abcdefghijklmnopqrstuvwxyz'
    let ret = ''
    for (let i = 0; i < lenreal; i++) {
      ret += letters[Math.floor(Math.random() * letters.length)]
    }
    console.log(ret, lenreal)
    return ret
  },
  isProcessor
}
];
searchables.sort((a, b) => {
  if (typeof a.name == 'function') return 0.5;
  if (typeof b.name == 'function') return -0.5;
  return +(a.name > b.name) - 0.5;
});
searchables.map((e, i) => {
  searchables[i].id = i;
});

function superiorSearch(searched, query) {
  let queryIrl = query.split('');
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
    searchables[0].name = '';
  }
  let found = 0;
  let i = 1;
  outputs = [];
  if (searchables[0].name) {
    found++;
    outputs.push(searchables[0]);
  }
  while (found < 5 && i < searchables.length) {
    try {
      if (
        superiorSearch(searchables[i].name, q) ||
        (typeof searchables[i].name == 'function' && searchables[i].name(q))
      ) {
        outputs.push(searchables[i]);
        found++;
      }
    } catch (e) {

    }
    i++;
  }
  magic_output.innerHTML = '';
  outputs.forEach(elem => {
    let result = document.createElement('div');
    result.classList.add('searchterm');
    result.classList.add('magicthingy');
    result.innerText =
      typeof elem.name == 'function' ? elem.name(q) : elem.name;
    if (elem.id == 0) {
      result.addEventListener('click', e => {
        console.log(elem, mode);
        if (searchables[mode].custom) searchables[mode].custom(q);
        else copyToClipBoard(result.innerText);
        renderoutput();
      });
    } else
      result.addEventListener('click', e => {
        console.log(elem);
        if (elem.isProcessor) {
          mode = elem.id;
          selectedindex = 0;
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
  const el = elemMaker('textarea', {
    value: text
  });
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
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