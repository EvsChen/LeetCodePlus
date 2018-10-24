
import TrieNode from './TrieNode';
import {AUTO_COMPLETE_START} from '../util/constants';
import {JavaScript, Java, Python, Cpp} from '../util/keywords';

const EDITOR_MODES = {
  JAVASCRIPT: 'text/javascript',
  PYTHON: 'text/x-python',
  JAVA: 'text/x-java',
  CPP: 'text/x-c++src',
};

class Trie {
  constructor() {
    this.root = new TrieNode();
    this.prefix = '';
    this.curNode = this.root;
    window.Trie = this;
  }

  loadArr(arr) {
    if (arr && arr.length) {
      arr.forEach((item) => this.insert(item));
    }
  }

  loadLang(modeName) {
    let langConfig;
    switch (modeName) {
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
    }
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
    const res = [];
    if (this.prefix.length < AUTO_COMPLETE_START) return;
    this.recNode(res, this.curNode, this.prefix);
    return res;
  }

  recNode(res, node, prefix) {
    if (node.isEnd) {
      res.push(prefix);
    }
    const keys = Object.keys(node.children);
    keys.forEach((key) => {
      const newPrefix = prefix + key;
      this.recNode(res, node.children[key], newPrefix);
    });
  }

  // TODO: better name for reset
  reset() {
    this.curNode = this.root;
    this.prefix = '';
    this.start = null;
  }
}

export default Trie;
