import SuggestionBox from './biz/SuggestionBox';
import Trie from './biz/Trie';
import { isFunctionKey, isAllowedInVariable ,$new, $$ } from './util/helper';
import { SELECTOR, AUTO_COMPLETE_ID, KEY, MIN_ENTRY_LENGTH } from './util/constants';

const TOKEN_TYPE = {
  KEYWORD: 'keyword',
  // def in js
  DEF: 'def',
  // variable in cpp
  VARIABLE: 'variable',
  OPERATOR: 'operator',
  PROPERTY: 'property',
  TYPE: 'type',
  BUILTIN: 'builtin'
};

// init trie
const trie = new Trie();

// init completion box
const autoCompleteBox = $new('div');
autoCompleteBox.id = AUTO_COMPLETE_ID;
document.body.appendChild(autoCompleteBox);
const box = document.getElementById(AUTO_COMPLETE_ID);
const sBox = new SuggestionBox();
sBox.append(box);

// init CodeMirror
const editor = $$(SELECTOR.EDITOR);
const CodeMirror = editor.CodeMirror;
function parseEditorTokens() {
  const lineNum = CodeMirror.doc.lineCount();
  for (let i = 0; i < lineNum; i++) {
    parseLineTokens(i);
  }
}

function parseLineTokens(lineNum) {
  CodeMirror.getLineTokens(lineNum).forEach(({ type, string }) => {
    if (string.length >= MIN_ENTRY_LENGTH && (
          type === TOKEN_TYPE.DEF || 
          type === TOKEN_TYPE.VARIABLE ||
          type === TOKEN_TYPE.KEYWORD ||
          type === TOKEN_TYPE.PROPERTY ||
          type === TOKEN_TYPE.TYPE || 
          type === TOKEN_TYPE.BUILTIN
        )) {
      trie.insert(string);
    }
  });
}

// parse init tokens
let mode = CodeMirror.getOption('mode');
trie.loadLang(
  typeof mode === 'object'
    ? mode.name
    : mode
);
parseEditorTokens();

window.addEventListener('keydown', evt => {
  if (!sBox.isVisible || sBox.options.length === 0) return;
  const key = event.key;
  if (!isFunctionKey(key)) return;
  evt.preventDefault();
  evt.stopPropagation();
  switch (key) {
    case KEY.ENTER:
    case KEY.TAB:
    {
      CodeMirror.doc.replaceRange(sBox.getSelectedText(), trie.getStartPos(), CodeMirror.getCursor());
      sBox.reset();
      trie.reset();
      break;
    }
    case KEY.ARROW_DOWN: {
      sBox.moveDown();
      break;
    }
    case KEY.ARROW_UP: {
      sBox.moveUp();
      break;
    }
  }
}, true);

CodeMirror.on('optionChange', onOptionChange);
CodeMirror.on('keyHandled', onKeyHandled);
CodeMirror.on('inputRead', onInputRead);
CodeMirror.on('blur', onBlur);

function onOptionChange(instance, optionStr) {
  // 'mode' indicates editor language change
  const newMode = CodeMirror.getOption('mode');
  if (optionStr === 'mode' && newMode !== mode) {
    // deep check the object for python2 and python3
    if (newMode.name && newMode.name === mode.name && newMode.version === mode.version) {
        return;
    }
    mode = CodeMirror.getOption('mode');
    trie.loadLang(
      typeof mode === 'object'
        ? mode.name
        : mode
    );
    parseEditorTokens();
  }
}

function onKeyHandled(instance, name, evt) {
  switch(name) {
    case KEY.ENTER: {
      sBox.reset();
      trie.reset();
      const {line, ch} = CodeMirror.getCursor();
      parseLineTokens(line - 1);
      break;
    }
    case KEY.BACKSPACE: {
      sBox.reset();
      trie.reset();
      break;
    }
    case 'Left':
    case 'Right': {
      sBox.reset();
      trie.reset();
      break;
    }
  }
}

function onInputRead(instance, changeObj) {
  const { from, to, text } = changeObj;
  if (text.length > 1 || text.length === 0) return;
  const char = text[0];
  // SPACE or SEMICOLON
  if (!isAllowedInVariable(char)) {
    sBox.reset();
    trie.reset();
    return;
  }
 if (/^[(){}]$/.test(char)) {
    sBox.reset();
    trie.reset();
    return;
 }
  if (!trie.hasStarted()) {
    trie.setStartPos(from);
  }
  sBox.fill(trie.input(char));
  const { left, top } = CodeMirror.cursorCoords('window');
  sBox.show();
  sBox.setPosition(left, top);
}

function onBlur() {
  if (sBox.isVisible) {
    sBox.reset();
    trie.reset();
    CodeMirror.focus();
  }
}
// editor.addEventListener('keydown', evt => {
//   // if any modifier key is pressed, ignore
//   if (evt.altKey || evt.ctrlKey || evt.metaKey) return;
//   const { key } = evt;
//   if (key === KEY.BACKSPACE) {
//     sBox.reset();
//     trie.reset();
//   }
//   else if (key === KEY.SPACE) {
//     sBox.reset();
//     trie.reset();
//   }
//   else if (key === KEY.ENTER) {
//     sBox.reset();
//     trie.reset();
//     const {line, ch} = CodeMirror.getCursor();
//     parseLineTokens(line - 1);
//   }
//   // TODO: faster compare function
//   else if (isNumberLetter(key)) {
//     // TODO: set the box position relative to the code editor
//     if (!trie.hasStarted()) {
//       const pos = CodeMirror.getCursor();
//       trie.setStartPos(pos);
//     }
//     sBox.fill(trie.input(key));
//     const { left, top } = CodeMirror.cursorCoords('window');
//     sBox.show();
//     sBox.setPosition(left, top);
//   }
// });

console.log('editor events binded!');
