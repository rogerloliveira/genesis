const BaseWebComponent = require('./base-webcomponent');

class WizardStep extends BaseWebComponent {
  template() {
    return `
<style>
:host(*) {
  display: block;
  width: 100%;
}
</style>
<slot></slot>
`;
  }

  constructor() {
    super();
    this.defineAttribute(['optional', false], 'caption', 'condition');
  }

  domTreeLoaded() {
    this.elements = this.querySelectorAll('input,select,textarea,options-container');
  }

  validate() {
    for (let element of this.elements) {
      if (!element.checkValidity()) {
        element.reportValidity();
        return false;
      }
    }
    return true;
  }
}
customElements.define('wizard-step', WizardStep);

class WizardForm extends BaseWebComponent {
  template() {
    return `
<style>
:host(*) {
  width: 100%;
  height: 100%;
  display: inline-grid;
  grid-template-columns: 100%;
  grid-template-rows: min-content 1fr min-content;
  grid-template-areas: "title" "pages" "actions";
  background: var(--wizard-form-background, #444);
  border: var(--wizard-form-border: 1px solid #333);
}

div#actions {
  display: grid;
  grid-template-columns: min-content min-content 1fr min-content;
  grid-template-rows: min-content;
  grid-template-areas: "prev next extra finish";
  grid-gap: .5rem;
  padding: .5rem;
}

h2#title {
  grid-area: title;
}

</style>
<div id="title">
  <slot name="title"></slot>
</div>
<div id="pages">
  <slot></slot>
</div>
<div id="actions">
  <div><slot name="prev-button"></slot></div>
  <div><slot name="next-button"></slot></div>
  <div><slot name="extras"></slot></div>
  <div><slot name="finish-button"></slot></div>    
</div>`;
  }

  constructor() {
    super();
  }

  domTreeLoaded() {
    this._form = this.findParentElement('form');
    this._prevButton = this.querySelector('[data-action="previous"]');
    this._prevButton.addEventListener('click', this.previousStep.bind(this));
    this._nextButton = this.querySelector('[data-action="next"]');
    this._nextButton.addEventListener('click', this.nextStep.bind(this));
    this._finishButton = this.querySelector('[data-action="finish"]');
    this._steps = this.querySelectorAll('wizard-step');

    for (let step of this._steps) {
      step.style.display = 'none';
    }
    this.currentStepIndex = 0;
  }

  get currentStep() {
    return this._steps[this._currentStep];
  }

  get maximumStepIndex() {
    return this._steps.length - 1;
  }

  set currentStepIndex(index) {
    let direction = this._currentStep > index ? -1 : 1;
    if (index < 0) {
      throw new Error("Step can't be lower than zero.");
    }

    if (index > this.maximumStepIndex) {
      throw new Error(`Step can't be greater than maximum step (${this._steps.length - 1}).`);
    }

    if (this.currentStep != null) {
      this.currentStep.style.display = 'none';
    }
    this._currentStep = index;

    while (this.currentStep.condition) {
      let [field, value] = this.currentStep.condition.split('=');
      if (this._form.elements[field].value !== value) {
        this._currentStep += direction;
      } else {
        break;
      }
    }

    this.currentStep.style.display = 'inline-block';
    this.raiseEvent('stepchange', { currentStepIndex: this.currentStepIndex, currentStep: this.currentStep });
  }

  get currentStepIndex() {
    return this._currentStep;
  }

  _setButtonState(button, state) {
    button.disabled = !state;
  }

  nextStep(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.currentStep.validate()) {
      return;
    }
    this.currentStepIndex = this.currentStepIndex + 1;
  }

  previousStep(event) {
    event.preventDefault();
    event.stopPropagation();
    this.currentStepIndex = this.currentStepIndex - 1;
  }

  stepchange$stepchanged() {
    this._setButtonState(this._prevButton, this.currentStepIndex > 0);
    this._setButtonState(this._nextButton, this.currentStepIndex < this.maximumStepIndex);
    this._setButtonState(this._finishButton, this.currentStepIndex === this.maximumStepIndex || this.currentStep.optional);
  }
}
customElements.define('wizard-form', WizardForm);