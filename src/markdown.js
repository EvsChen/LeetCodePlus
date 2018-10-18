import TurndownService from 'turndown';
import { getDashedProblemName, $$ } from './util/helper';
import { SELECTOR, BUTTON_CLASS } from './util/constants';

const turndownService = new TurndownService();
// the html tags that the md parser will keep unchanged
turndownService.keep(['pre']);
// turndownService.addRule('codeblock', {
//   filter: ['pre'],
//   replacement: content => `
//   <pre><code>
//     ${content}
//   </code></pre>
//   `
// });
const MARKDOWN_GEN_ID = 'markdown-gen';
const PROBLEM_DESC_SELECTOR = "div[class^='content']";
const LANG_SELECTION_SELECTOR = '.ant-select-selection-selected-value';

/**
 * @param {DOMNode} nodeToAppend the DOM node to append the generator button
 */
function initMarkdownGenerator(cmInstance, nodeToAppend) {
  if (!nodeToAppend) return;
  const CodeMirror = cmInstance;
  const button = document.createElement('div')
  button.innerText = 'Markdown ⤓';
  button.id = MARKDOWN_GEN_ID;
  button.className = BUTTON_CLASS;
  button.onclick = donwloadMD;
  nodeToAppend.appendChild(button);

  /**
   * @param {string} filename - the downloaded file name
   * @param {string} md - the complete md doc in string
   */
  function donwloadMD() {
    const element = document.createElement('a');
    const content = generateMarkdown();
    const filename = `${getDashedProblemName()}.md`;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * generate the markdown string 
   * @returns {string} res - the complete md doc in string
   */
  function generateMarkdown() {
    const title = $$(SELECTOR.TITLE);
    const problemUrl = window.location.toString();
    const problemDesc = $$(PROBLEM_DESC_SELECTOR);
    const lang = $$(LANG_SELECTION_SELECTOR).innerText;
    const descInMd = turndownService.turndown(problemDesc);
    const solutionInMd = generateSolutionMd(lang);
    const titleText = title ? `# [${title.innerText}](${problemUrl})` : '';
    let res = 
`${titleText}

${descInMd}

Solution in ${lang}:
${solutionInMd}
`;
    return res;
  }

    /**
     * build the solution string in md
     * @param {string} lang - language name of the solution, e.g. 'JavaScript'
     */
    function generateSolutionMd(lang) {
      const lines = document.getElementsByClassName('CodeMirror-line');
      let res = '';
      Array.from(lines).forEach(node => {
        // handle unexpected red point
        const text = String.fromCodePoint(
          ...node.innerText.split('').map(c => c.codePointAt(0) === 160 ? 32 : c.codePointAt(0))
        );
        res =
`${res}
${text}`;
      });
      res = 
`\`\`\`\`${lang.toLowerCase()}
${res}
\`\`\`\``;
      return res;
    }
}



export {
  initMarkdownGenerator
};