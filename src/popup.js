import './styles/popup.css';

const optionLink = document.getElementById('option-link');
optionLink.onclick = () => chrome.runtime.openOptionsPage();


