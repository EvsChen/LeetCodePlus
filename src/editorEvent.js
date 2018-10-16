import SuggestionBox from './util/SuggestionBox';
import { isNumberLetter, isFunctionKey, $new, $$ } from './util/helper';
import Trie from './util/Trie';
import { SELECTOR, AUTO_COMPLETE_ID, KEY, TOKEN_TYPE } from './util/constants';

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
    if (type === TOKEN_TYPE.DEF || 
        type === TOKEN_TYPE.VARIABLE ||
        type === TOKEN_TYPE.KEYWORD) {
      trie.insert(string);
    }
  });
}

// parse init tokens
const initMode = CodeMirror.getOption('mode');
trie.loadLang(
  typeof initMode === 'object'
    ? initMode.name
    : initMode
);
parseEditorTokens();

window.addEventListener('keydown', evt => {
  if (!sBox.isVisible) return;
  const key = event.key;
  if (!isFunctionKey(key)) return;
  evt.preventDefault();
  evt.stopPropagation();
  switch (key) {
    case KEY.ENTER:
    case KEY.TAB:
    {
      CodeMirror.doc.replaceRange(sBox.getSelectedText(), trie.getStartPos(), CodeMirror.getCursor());
      sBox.hide();
      trie.reset();
      break;
    }
    case KEY.ESCAPE: {
      sBox.hide();
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

function onOptionChange(instance, optionStr) {
  // 'mode' indicates editor language change
  if (optionStr === 'mode') {
    const newMode = CodeMirror.getOption('mode');
    trie.loadLang(
      typeof newMode === 'object'
        ? newMode.name
        : newMode
    );
    parseEditorTokens();
  }
}

editor.addEventListener('keydown', evt => {
  // if any modifier key is pressed, ignore
  if (evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) return;
  const { key } = evt;
  if (key === KEY.BACKSPACE) {
    sBox.hide();
    trie.reset();
  }
  else if (key === KEY.SPACE) {
    sBox.hide();
    trie.reset();
  }
  else if (key === KEY.ENTER) {
    sBox.hide();
    trie.reset();
    const {line, ch} = CodeMirror.getCursor();
    parseLineTokens(line - 1);
  }
  // TODO: faster compare function
  else if (isNumberLetter(key)) {
    // TODO: set the box position relative to the code editor
    if (!trie.hasStarted()) {
      const pos = CodeMirror.getCursor();
      trie.setStartPos(pos);
    }
    sBox.fill(trie.input(key));
    const { left, top } = CodeMirror.cursorCoords('window');
    sBox.show();
    sBox.setPosition(left, top);
  }
});

console.log('editor events binded!');
