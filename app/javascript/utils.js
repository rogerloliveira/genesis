/* global Loader, message */
window.Loader = {
  show () {
    this.loader.style.display = 'flex'
  },

  hide () {
    this.loader.style.display = 'none'
  },

  init () {
    this.loader = document.querySelector('#loading')
  }
}

window.message = function (message, type = 'info') {
  document.querySelector('#messages').appendNewChild('text-box', { class: type }, message)
}

window.alert = function (m) {
  message(m, 'warning')
}

window.addEventListener('load', Loader.init.bind(Loader))
