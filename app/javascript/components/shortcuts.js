'use strict';

window.Shortcut = {
  _registeredActions: new Map(),
  _registeredShortcuts: new Map(),
  _actionNameIndex: 0,

  _parseShortcut(shortcut) {
    if (!/^(?:(ctrl|alt|shift)\+){0,3}[a-z0-9]+$/i.test(shortcut)) {
      throw new Error('Invalid shortcut combination');
    }
  },

  onKeyUp(event) {
    let { ctrlKey, shiftKey, altKey, code } = event;
    let tokens = [];
    if (ctrlKey) { tokens.push('ctrl'); }
    if (altKey) { tokens.push('alt'); }
    if (shiftKey) { tokens.push('shift'); }
    tokens.push(code.toLowerCase().replace(/(key|digit)/, ''));
    let shortcut = tokens.join('+').toLowerCase();

    if (this._registeredShortcuts.has(shortcut)) {
      event.preventDefault();
      event.stopPropagation();
      this.execute(this._registeredShortcuts.get(shortcut));
    }
  },

  nextActionName() {
    this._actionNameIndex++;
    return `Action${this._actionNameIndex}`;
  },

  execute(name) {
    this._registeredActions.get(name)();
  },

  /**
   * Register a named action with an optional shortcut
   * @param {String} name Action name
   * @param {CallableFunction} callback Action to be executed
   * @param {String} shortcut Any shortcut to listen globally
   */
  registerAction(name, callback, shortcut = null) {
    this._registeredActions.set(name, callback);
    if (shortcut) {
      this._parseShortcut(shortcut.toLowerCase());
      this._registeredShortcuts.set(shortcut.toLowerCase(), name);
    }
  },

  start() {
    document.addEventListener('keydown', this.onKeyUp.bind(this));
    let elements = document.querySelectorAll('[shortcut]');
    for (let element of elements) {
      let actionName = this.nextActionName();
      this.registerAction(actionName, element.click.bind(element), element.getAttribute('shortcut'));
    }
  }
};

export default Shortcut;