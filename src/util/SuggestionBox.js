import {CLASS} from './constants';
const selectedClass = CLASS.SELECTED_SUGGESTION_ITEM;

class SuggestionBox {
  constructor() {
    this.node = null;
    this.selectedText = '';
    this.selectedIndex = 0;
    this.options = [];
    this.isVisible = false;
  }

  append(node) {
    this.node = node;
  }

  setPosition(x, y) {
    this.node.style.left = `${x}px`;
    this.node.style.top = `${y}px`;
  }

  getSelectedText() {
    return this.selectedText;
  }

  getSelectedIndex() {
    return this.selectedIndex;
  }

  moveUp() {
    if(this.options.length === 0) return;
    const selectedIndex = this.selectedIndex
    if (selectedIndex === 0) return;
    this.options[selectedIndex].classList.remove(selectedClass);
    this.options[selectedIndex - 1].classList.add(selectedClass);
    this.selectedIndex--;
    this.selectedText = this.options[selectedIndex - 1].innerText;
  }

  moveDown() {
    if(this.options.length === 0) return;
    const selectedIndex = this.selectedIndex;
    if (selectedIndex === this.options.length - 1) return;
    this.options[selectedIndex].classList.remove(selectedClass);
    this.options[selectedIndex + 1].classList.add(selectedClass);
    this.selectedIndex++;
    this.selectedText = this.options[selectedIndex + 1].innerText;
  }

  fill(arr) {
    if (!this.node) return;
    if (!arr || arr.length === 0) {
      this.clear();
      this.hide();
      return;
    }
    let html = '';
    arr.forEach((word, ind) => {
      if (ind === 0) {
        html += `<div class="suggestion ${CLASS.SELECTED_SUGGESTION_ITEM}">${word}</div>`;
      }
      else {
        html += `<div class="suggestion">${word}</div>`;
      }
    });
    this.node.innerHTML = html;
    this.options = Array.from(this.node.children);
    this.selectedIndex = 0;
    this.selectedText = this.options[0].innerText;
  }

  clear() {
    if (this.node) {
      this.node.innerHTML = '';
    }
    this.options = [];
    this.selectedIndex = 0;
    this.selectedText = '';
  }

  hide() {
    this.node.style.display = 'none';
    this.isVisible = false;
  }

  reset() {
    this.clear();
    this.hide();
  }

  show() {
    this.node.style.display = 'block';
    this.isVisible = true;
  }

}

export default SuggestionBox;