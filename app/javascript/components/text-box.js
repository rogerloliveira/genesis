class TextBox extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
<style>
  :host {
    display: none;
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: auto;
    align-items: center;
    align-content: center;
    grid-gap: .5rem;
    padding: .5rem;
  }
  
  i, button {
    border: none;
    background: none;
    font-family: "Material Icons";
    font-style: normal;
    font-size: 1.2rem;
    color: inherit;
  }
</style>
<i></i>
<div><slot></slot></div>
<button type="button">close</button>
`;
  }

  connectedCallback() {
    this._icon = this.shadowRoot.querySelector('i');
    this._icon.innerText = this.icon;
    this._closeButton = this.shadowRoot.querySelector('button');
    this._closeButton.addEventListener('click', this.close.bind(this));
    this.persistent = this.hasAttribute('persistent');

    if (this.persistent && this.hasAttribute('id')) {
      let key = `${document.location.pathname.substring(1)}#${this.id}`;
      if (localStorage.getItem(key) === 'true') {
        return;
      }
    }
    this.open();
  }

  get icon() {
    return this.getAttribute('icon');
  }

  set icon(value) {
    this.setAttribute('icon', value);
    this._icon.innerText = value;
  }

  open() {
    this.style.display = 'grid';
  }

  close() {
    this.style.display = 'none';

    if (this.persistent && this.hasAttribute('id')) {
      let key = `${document.location.pathname.substring(1)}#${this.id}`;
      localStorage.setItem(key, 'true');
    }
  }
}
customElements.define('text-box', TextBox);
