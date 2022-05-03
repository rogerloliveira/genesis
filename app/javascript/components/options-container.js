const BaseWebComponent = require('./base-webcomponent');

class OptionsItem extends BaseWebComponent {
  constructor() {
    super();
    this.defineAttribute('item-id');
  }

  click$onclick() {
    this.raiseEvent('select', { target: this });
  }
}
customElements.define('options-item', OptionsItem);

class OptionsContainer extends BaseWebComponent {
  template() {
    return `
<slot name="input"></slot>
<slot></slot>
`;
  }

  domTreeLoaded() {
    this._input = this.querySelector('input');
    this._input.style.display = 'none';
    this._options = this.querySelectorAll('options-item');
    this.currentOption = null;
  }

  select$onselect(event) {
    if (this.currentOption) {
      this.currentOption.classList.remove('selected');
    }

    this.currentOption = event.target;
    this.currentOption.classList.add('selected');

    this._input.value = event.target.itemId;
  }

  checkValidity() {
    return this._input.checkValidity();
  }

  reportValidity() {
    this._input.reportValidity();
  }
}
customElements.define('options-container', OptionsContainer);