
import TrieNode from './TrieNode';
import { EDITOR_MODES } from './constants';
import { JavaScript, Java, Python, Cpp } from './keywords';

class Trie {
  constructor() {
    this.root = new TrieNode();
    this.prefix = '';
    this.curNode = this.root;
  }

  loadArr(arr) {
    if (arr && arr.length) {
      arr.forEach(item => this.insert(item));
    }
  }

  loadLang(modeName) {
    let langConfig;
    switch(modeName) {
      case EDITOR_MODES.JAVASCRIPT:
        langConfig = JavaScript;
        break;
      case EDITOR_MODES.JAVA:
        langConfig = Java;
        break;
      case EDITOR_MODES.CPP:
        langConfig = Cpp;
        break;
      case EDITOR_MODES.PYTHON:
        langConfig = Python;
        break;
      default:
        langConfig = [];
    };
    console.log(`config for ${modeName} has been loaded`);
    this.reset();
    this.root = new TrieNode();
    this.loadArr(langConfig);
  }

  hasStarted() {
    return !!this.start;
  }

  getStartPos() {
    return this.start;
  }

  setStartPos({line, ch}) {
    this.start = {line, ch};
  }

  insert(str) {
    const len = str.length;
    let node = this.root;
    for (let i = 0; i < len; i++) {
      const char = str.charAt(i);
      node.isEnd = false;
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEnd = true;
  }

  save() {
    if (this.prefix === '') return;
    this.insert(this.prefix);
  }

  input(char) {
    this.prefix += char;
    if (this.curNode) {
      // if is end
      if (this.curNode.isEnd) {
        return [this.prefix];
      }
      this.curNode = this.curNode.children[char];
      // if children[char] not exist
      if (!this.curNode) {
        return [];
      }
      return this.printSuggestions();
    }
    return [];
  }

  printSuggestions() {
    let res = [];
    this.recNode(res, this.curNode, this.prefix);
    return res;
  }

  recNode(res, node, prefix) {
    if (node.isEnd) {
      res.push(prefix);
    }
    else {
      let keys = Object.keys(node.children);
      keys.forEach(key => {
        const newPrefix = prefix + key;
        this.recNode(res, node.children[key], newPrefix);
      });
    }
  }

  // TODO: better name for reset
  reset() {
    this.curNode = this.root;
    this.prefix = '';
    this.start = null;
  }
}

export default Trie;