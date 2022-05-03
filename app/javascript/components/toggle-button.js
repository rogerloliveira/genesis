class ToggleButton extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow( { mode: 'open' });
    shadowRoot.innerHTML = '<slot></slot>';
  }
  connectedCallback() {
    this.mode = this.getAttribute('mode');
    if (!this.hasAttribute('target-display-class')) {
      this.setAttribute('target-display-class', 'inline-block');
    }
    if (!this.hasAttribute('target-display-hidden-class')) {
      this.setAttribute('target-display-hidden-class', 'none');
    }
    if (this.mode === 'copy') {
      this.addEventListener('click', this.copy.bind(this));
    } else {
      this.addEventListener('click', this.toggle.bind(this));
    }
  }

  target() {
    return document.getElementById(this.getAttribute('target'));
  }

  render() {
    if (this.state) {
      this.classList.add(this.pressedClass);
      this.target().style.display = this.targetDisplayClass;
    } else {
      this.classList.remove(this.pressedClass);
      this.target().style.display = this.targetDisplayHiddenClass;
    }
  }

  copy() {
    navigator.clipboard.writeText(this.target().innerText);
  }

  toggle() {
    this.state = !this.state;
  }

  get state() {
    return this.hasAttribute('on');
  }

  set state(value) {
    if (value) {
      this.setAttribute('on', value);
    } else {
      this.removeAttribute('on');
    }

    this.render();
  }

  get pressedClass() {
    return this.getAttribute('pressedClass');
  }

  get targetDisplayClass() {
    return this.getAttribute('target-display-class');
  }

  get targetDisplayHiddenClass() {
    return this.getAttribute('target-display-hidden-class');
  }
}
customElements.define('toggle-button', ToggleButton);