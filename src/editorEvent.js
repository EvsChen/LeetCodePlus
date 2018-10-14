import SuggestionBox from './util/SuggestionBox';
import { isNumberLetter, isFunctionKey, $new, $$ } from './util/helper';
import Trie from './util/Trie';
import { JS_KEYWORD } from './util/keywords'
import { SELECTOR, AUTO_COMPLETE_ID, KEY, TOKEN_TYPE } from './util/constants';

// init trie
const trie = new Trie(JS_KEYWORD);

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
console.log(CodeMirror);
parseInitTokens();

function parseLineTokens(lineNum) {
  const listOfTokens = CodeMirror.getLineTokens(lineNum);
  listOfTokens.forEach(token => {
    if (token.type === TOKEN_TYPE.DEF) {
      trie.insert(token.string);
    }
  });
}

function parseInitTokens() {
  const lineNum = CodeMirror.doc.lineCount();
  for (let i = 0; i < lineNum; i++) {
    parseLineTokens(i);
  }
}

window.addEventListener('keydown', evt => {
  if (!sBox.isVisible) return;
  const key = event.key;
  if (!isFunctionKey(key)) return;
  // TODO: display better? necessary?
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

editor.addEventListener('keydown', ({key}) => {
  console.log(key, 'down');
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
