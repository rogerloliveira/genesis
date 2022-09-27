class ToggleButton extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = '<slot></slot>';
  }

  connectedCallback() {
    this.mode = this.getAttribute('mode');

    if (this.mode === 'copy') {
      this.addEventListener('click', this.copy.bind(this));
    } else {
      this.addEventListener('click', this.toggle.bind(this));
    }
  }

  target() {
    if (!this._target) {
      this._target = document.getElementById(this.getAttribute('target'));
    }

    return this._target;
  }

  render() {
    if (this.state) {
      this.target().classList.remove(this.hiddenClass)
      this.target().classList.add(this.visibleClass)
    } else {
      this.target().classList.remove(this.visibleClass)
      this.target().classList.add(this.hiddenClass)
    }
  }

  copy () {
    const target = this.target()

    if (typeof target.value !== 'undefined') {
      navigator.clipboard.writeText(target.value)
    } else {
      navigator.clipboard.writeText(target.innerText)
    }
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

  get visibleClass() {
    return this.getAttribute('visible-class');
  }

  get hiddenClass() {
    return this.getAttribute('hidden-class');
  }
}

customElements.define('toggle-button', ToggleButton);
