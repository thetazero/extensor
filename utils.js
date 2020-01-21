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
  consolelog(found)
  return found;
}

function mm(q) {
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
}