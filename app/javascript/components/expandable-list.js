class ExpandableList extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
<style>
  :host(*) {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;    
  }

  #label {
    display: block;
    padding: .5rem;
    font-weight: bold;
  }
  
  #area {
    overflow-x: auto;
  }
  
  h3 {
    margin: 0;
  }
  
</style>
<h3 id="label"></h3>
<div id="area">
  <slot></slot>
</div>
`;
  }

  connectedCallback() {
    this.label = this.shadowRoot.getElementById('label');
    this.label.innerText = this.getAttribute('caption');
  }
}

customElements.define('expandable-list', ExpandableList);

class ExpandableItem extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
<style>
  #label {
    display: block;
    padding: .5rem;
    font-weight: bold;
    cursor: pointer;
  }
</style>
<span id="label"></span>
<div id="area">
  <slot></slot>
</div>
`;
  }

  connectedCallback() {
    this.label = this.shadowRoot.getElementById('label');
    this.label.innerText = this.getAttribute('caption');
    this.label.addEventListener('click', this.toggle.bind(this));
    this.area = this.shadowRoot.getElementById('area');
    this.expanded = this.hasAttribute('expanded') || this.parentNode.hasAttribute('expanded');
  }

  set expanded(value) {
    this._expanded = value;
    if (value) {
      this.setAttribute('expanded', 'expanded');
    } else {
      this.removeAttribute('expanded');
    }

    this.area.style.display = this._expanded ? 'block' : 'none';
  }

  get expanded() {
    return this._expanded;
  }

  expand() {
    this.expanded = true;
  }

  collapse() {
    this.expanded = false;
  }

  toggle() {
    this.expanded = !this.expanded;
  }
}

customElements.define('expandable-item', ExpandableItem);
