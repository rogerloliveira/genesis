class LocalizedTime extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `<slot></slot>`;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = this.time.toLocaleString();
  }

  get time() {
    let date_time = new Date(this.getAttribute('time'));
    return date_time;
  }
}
customElements.define('localized-time', LocalizedTime);
