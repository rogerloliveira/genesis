class TabNav extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `<slot></slot>`;
    this.currentTab = null;
  }

  connectedCallback() {
    this.addEventListener('tabshow', this.onTabClick.bind(this));
  }

  onTabClick(event) {
    if (this.currentTab) {
      this.currentTab.active = false;
    }
    this.currentTab = event.detail.tab;
    this.currentTab.active = true;
  }
}
customElements.define('tab-nav', TabNav);

class TabButton extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `<slot></slot>`;
  }

  connectedCallback() {
    this.addEventListener('click', this.onClick.bind(this));
    this._target = document.getElementById(this.target);
    if (this.hasAttribute('active')) {
      this.active = true;
      this.dispatchClickEvent();
    } else {
      this.active = false;
    }
  }

  get target() {
    return this.getAttribute('target');
  }

  set target(value) {
    this.setAttribute('target', value);
    this._target = document.getElementById(value);
  }

  get active() {
    return this.hasAttribute('active');
  }

  set active(value) {
    if (value) {
      this.setAttribute('active', 'true');
      this._target.style.zIndex = '10';
    } else {
      this.removeAttribute('active');
      this._target.style.zIndex = '0';
    }
  }

  onClick() {
    if (this.active) {
      return;
    }

    this.dispatchClickEvent();
  }

  dispatchClickEvent() {
    let event = new CustomEvent('tabshow', { cancelable: true, bubbles: true, detail: { tab: this } });
    this.dispatchEvent(event);
  }
}
customElements.define('tab-button', TabButton);
