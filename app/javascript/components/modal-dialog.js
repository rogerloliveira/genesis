class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' } ).innerHTML = `
<style>
  * {
    box-sizing: border-box;
  }
  :host {
    position: absolute;
    display: none;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
    background: rgba(128, 128, 128, 0.2);
  }
  #dialog {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: min-content 1fr min-content;
    background: #f8f9fa;
    box-shadow: 1px 1px 5px gray;
  }
  #header {
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-areas: "title buttons";
    background: rgba(0, 0, 0, 0.1);
    border-bottom: rgba(0, 0, 0, 0.2) solid 1px;
    padding: 0 0.5em;
  }
  #title {
    grid-area: title;
    margin: 0;
    padding: 0.25em 0;
  }
  #buttons {
    display: inline-grid;
    grid-auto-columns: 2em;
    grid-template-rows: auto;
  }
  #title-buttons button {
    font-family: "Material Icons";
    font-size: 1.3em;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    height: 100%;
  }
  #title-buttons button:hover {
    color: red;
  }
  #content {
    position: relative;
    padding: 0.5em;
  }
  #footer {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: min-content;
    grid-template-areas: "left center right";
    padding: 0.5em;
  }
  .center-buttons {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    text-align: center;
  }
  .standard-button {
    border: rgba(0, 0, 0, 0.2) 1px solid;
    background: rgba(0, 0, 0, 0.1);
    padding: 0.5em 1em;
  }
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
<div id="dialog">
  <div id="header">
    <h3 id="title"></h3>
    <span id="title-buttons">
      <button type="button" id="close-button" data-resolve="false" data-data="cancel">close</button>    
    </span>
  </div>
  <div id="content">
    <slot></slot>
  </div>
  <div id="footer">
    <div class="left-buttons"><slot name="left"></slot></div>
    <div class="center-buttons"><slot name="center"></slot></div>
    <div class="right-buttons"><slot name="right"></slot></div>
  </div>
</div>
`;
  }

  connectedCallback() {
    this._title = this.shadowRoot.getElementById('title');
    this._content = this.shadowRoot.getElementById('content');
    this._buttons = new Map([
      ['left', this.shadowRoot.getElementById('left')],
      ['center', this.shadowRoot.getElementById('center')],
      ['right', this.shadowRoot.getElementById('right')]
    ]);
    this._footer = this.shadowRoot.getElementById('footer');
    this._footer.addEventListener('click', this.onButtonClick.bind(this));
    this._close_button = this.shadowRoot.getElementById('close-button');
    this._close_button.addEventListener('click', this.onButtonClick.bind(this));
    this._title.innerHTML = this.caption;
  }

  get caption() {
    return this.getAttribute('caption');
  }

  set caption(value) {
    this.setAttribute('caption', value);
    this._title.innerHTML = value;
  }

  get closeButton() {
    return this._close_button.style.display = 'inline';
  }

  set closeButton(value) {
    this._close_button.style.display = value ? 'inline' : 'none';
  }

  set buttons(options) {
    ['left', 'center', 'right'].forEach((position) => {
      this._buttons.get(position).innerHTML = ''; 
    });
    for (let button of options) {
      let newButton = document.createElement('button');
      newButton.innerHTML = button.caption;
      newButton.dataset.data = button.data;
      newButton.dataset.resolve = button.resolve;
      newButton.className = 'standard-button';
      this._buttons.get(button.position).appendChild(newButton);
    }
  }

  onButtonClick(event) {
    let button = event.target;
    if (button.tagName.toLowerCase() !== 'button') {
      return;
    }

    this.close(button.dataset.resolve === 'true', button.dataset.data);
  }

  show(options = {}) {
    return new Promise((resolve, reject) => {
      if (options.hideCloseButton) {
        this.closeButton = false;
      }
      if (options.width) {
        this._content.style.width = options.width;  
      }
      if (options.height) {
        this._content.style.height = options.height;
      }
      this.resolve = resolve;
      this.reject = reject;
      this.style.display = 'inline-flex';
    });
  }

  dialogBox(caption, text, buttons, options = {}) {
    this.caption = caption;
    this._content.innerHTML = `<p>${text}</p>`;
    this.buttons = buttons;
    return this.show(options);
  }

  messageBox(caption, text, options = {}) {
    return this.dialogBox(caption, text, [{ caption: '✔', data: 'ok', resolve: true, position: 'center' }], options);
  }

  confirmationBox(caption, text, options = {}) {
    return this.dialogBox(caption, text, [
      { caption: '✔', data: 'yes', resolve: true, position: 'left' },
      { caption: '❌', data: 'no', resolve: true, position: 'right' }
    ], options);
  }

  close(resolve, data = '') {
    this.style.display = 'none';
    if (resolve) {
      this.resolve(data);
    } else {
      this.reject(data);
    }
  }
}
customElements.define('modal-dialog', ModalDialog);