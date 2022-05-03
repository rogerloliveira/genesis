class BaseWebComponent extends HTMLElement {
  constructor() {
    super();
    this.bindableElements = new Map();
    this.bindableAttributes = new Map();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = this.template();
  }

  template() {
    return '<slot></slot>';
  }

  domTreeLoaded() {
    // Placeholder
  }

  raiseEvent(eventName, detail, cancelable = true, bubbles = true) {
    let event = new CustomEvent(eventName, { bubbles: bubbles, cancelable: cancelable, detail: detail });
    this.dispatchEvent(event);
  }

  /**
   * This function registers "magic events".
   * Magic events are special methods following a name pattern to auto register event listeners.
   * The name pattern consists of the event trigger followed by a dollar sign and the method name.
   * Pattern sample: click$sayHello
   */
  registerEvents() {
    for (let prop of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (prop.indexOf('$') > 0 && typeof this[prop] === 'function') {
        let [_, listener] = /^([a-z]+)\$.+/.exec(prop);
        this.addEventListener(listener, this[prop].bind(this));
      }
    }
  }

  prepareBindableElements() {
    for (let [attr, _] of this.bindableElements) {
      // Save a reference to the bindable element
      let element = this.shadowRoot.getElementById(attr);
      if (!element) { throw new Error(`Element ${attr} not found.`); }
      this.bindableElements.set(attr, element);
      element.innerText = this.getAttribute(attr);

      Object.defineProperty(this, attr, {
        get() {
          return this.getAttribute(attr);
        },
        set(value) {
          this.setAttribute(attr, value);
          let element = this.bindableElements.get(attr);
          element.innerText = value;
        }
      })
    }
  }

  prepareBindableAttributes(nodes) {
    for (let node of nodes) {
      if (node.nodeType !== 1) { continue; }
      for (let attr of node.attributes) {
        let result = /^%([a-z]+)$/.exec(attr.value);
        if (!result) {
          continue
        }
        let [_, name] = result
        if (name) {
          this.bindableAttributes.set(name, attr);
          attr.value = this.getAttribute(name);

          Object.defineProperty(this, name, {
            get() {
              return this.getAttribute(attr);
            },
            set(value) {
              this.setAttribute(name, value);
              let attribute = this.bindableAttributes.get(name);
              attribute.value = value;
            }
          })
        }
      }

      this.prepareBindableAttributes(node.childNodes);
    }
  }

  /**
   * Called by native code when this element is attached to the DOMTree
   */
  connectedCallback() {
    this.prepareBindableElements();
    this.prepareBindableAttributes(this.shadowRoot.childNodes);
    this.registerEvents();
    if (document.readyState === 'interactive') {
      this.domTreeLoaded();
    } else {
      document.addEventListener('readystatechange', event => {
        if (event.target.readyState === 'interactive') {
          this.domTreeLoaded();
        }
      })
    }
  }

  defineBindableElement(...attrs) {
    for (let attr of attrs) {
      this.bindableElements.set(attr, null);
    }
  }

  defineBindableAttribute(...attrs) {
    for (let attr of attrs) {
      this.bindableAttributes.set(attr, null);
    }
  }

  _camelize(text) {
    let words = text.split('-');
    for (let i = 1; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1);
    }
    return words.join('');
  }

  defineAttribute(...attrs) {
    for (let prop of attrs) {
      let name = '';
      let defaultValue = null;

      if (typeof prop === 'string') {
        name = prop;
      } else {
        name = prop[0]
        defaultValue = prop[1]
      }
      let propName = this._camelize(name);

      Object.defineProperty(this, propName, {
        get() {
          return this.getAttribute(name) || defaultValue;
        },
        set(value) {
          this.setAttribute(name, value);
         }
      })
    }
  }

  findParentElement(tagName, node = this) {
    if (node.parentNode.tagName.toUpperCase() === tagName.toUpperCase()) {
      return node.parentNode;
    } else {
      this.findParentElement(tagName, node.parentNode);
    }
  }
}

module.exports = BaseWebComponent;