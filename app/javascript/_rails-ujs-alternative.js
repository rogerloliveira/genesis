function fire(eventName, data, cancellable, bubbles) {
  let event = new CustomEvent(eventName, { detail: data, cancelable: cancellable, bubbles: bubbles });
  self.dispatchEvent(event);
}

HTMLDocument.prototype.fire = fire;
HTMLElement.prototype.fire = fire;

/**
 *
 * @param tagName Element name
 * @param { Object } attributes List of attributes
 * @param { String } innerHTML Any html content
 * @returns { HTMLElement }
 */
HTMLElement.prototype.appendNewChild = function(tagName, attributes = null, innerHTML = null) {
  let newElement = document.createElement(tagName);

  for (let attrName in attributes) {
    if (attributes.hasOwnProperty(attrName)) {
      newElement.setAttribute(attrName, attributes[attrName]);
    }
  }

  if (innerHTML) {
    newElement.innerHTML = innerHTML;
  }

  this.appendChild(newElement);
  return newElement;
};

const Rails = {
  asyncRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      try {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('X-CSRF-Token', Rails.csrf.token);
        //xhr.setRequestHeader('Accept', 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript');
        xhr.setRequestHeader('Accept', 'Application/html');
        xhr.onload = () => {
          if (xhr.status === 200) {
            if (responseParser.toLowerCase() === 'json') {
              resolve(JSON.parse(xhr.responseText));
            } else if (responseParser.toLowerCase() === 'xml') {
              let parser = new DOMParser();
              resolve(parser.parseFromString(xhr.responseText, 'application/xml'));
            } else {
              resolve(xhr.responseText);
            }
          } else {
            reject(xhr.status);
          }
        };
        document.fire('ajax:beforeSend', [xhr]);
        xhr.send(data);
        document.fire('ajax:send', [xhr]);
      } catch(e) {
        reject(`Failed to process the request on ${URL} with error: ${e.message}.`);
      }
    });
  },
  hiddenFormRequest(action, method, target) {
    let form = document.body.appendNewChild('form', { action: action, method: 'post', style: 'display: block;' });
    form.appendNewChild('input', { name: Rails.csrf.param, value: Rails.csrf.token, type: 'hidden' });
    form.appendNewChild('input', { name: '_method', value: method, type: 'hidden' });
    let button = form.appendNewChild('button', { type: 'submit', });

    if (target) {
      form.target = target;
    }

    button.click();
  },
  csrf: {
    get param() {
      return document.querySelector('meta[name="csrf-param"]').content;
    },
    get token() {
      return document.querySelector('meta[name="csrf-token"]').content;
    }
  },
  handlers: new Map(),
  registerHandler(handlerName, handler) {
    this.handlers.set(handlerName, handler);
  },
  defaultConfirmationHandler(event) {
    return new Promise((resolve, reject) => {
      if (confirm(event.target.dataset.confirm)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  async confirmationHandler(event) {
    if (this.handlers.has('confirmation')) {
      return await this.handlers.get('confirmation')(event);
    } else {
      return await this.defaultConfirmationHandler(event);
    }
  },
  async methodHandler(event) {
    event.stopPropagation();
    event.preventDefault();
    let target = event.currentTarget;

    if (target.dataset.confirm) {
      let proceed = await this.confirmationHandler(event);
      if (!proceed) {
        return;
      }
    }

    if (target instanceof HTMLAnchorElement && target.dataset.method) {
      this.hiddenFormRequest(target.href, target.dataset.method);
    }
  },
  registerEvent(selector, eventName, eventHandler) {
    for (let element of document.querySelectorAll(selector)) {
      element.addEventListener(eventName, eventHandler);
    }
  },
  start() {
    this.registerEvent('a[data-method]', 'click', this.methodHandler.bind(this));
  }
};
window.addEventListener('load', Rails.start.bind(Rails));