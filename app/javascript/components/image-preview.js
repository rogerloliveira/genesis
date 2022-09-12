class ImagePreview extends HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = `    
<style>    
:host(*){
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

:host([status='empty']):before {
  content: attr(text); 
}
</style>
`
    if (this.hasAttribute('target-input')) {
      this.input = document.getElementById(this.getAttribute('target-input'))
    } else {
      console.log('Input file not defined')
      return
    }

    this.setAttribute('status', 'empty')
    this.source = null
  }

  set text (value) {
    this.setAttribute('text', value)
  }

  get text () {
    return this.getAttribute('text')
  }

  set status (value) {
    this.setAttribute('status', value)
    this._dispatch('statuschange', value)
  }

  get status () {
    return this.getAttribute('status')
  }

  onClick () {
    this.input.click()
  }

  onChange () {
    this.file = this.input.files[0]
    this.source = 'fileUpload'
    this.render()
  }

  onDragOver (event) {
    event.preventDefault()
    this.status = 'dragging'
  }

  onDragLeave () {
    if (!this.file) {
      this.setAttribute('status', 'empty')
    } else {
      this.setAttribute('status', 'ready')
    }
  }

  onDrop (event) {
    event.preventDefault()
    this.file = event.dataTransfer.files[0]
    this.source = 'dragAndDrop'
    this.render()
  }

  onPaste (event) {
    try {
      this.file = event.clipboardData.items[1].getAsFile()
      this.source = 'clipboard'
      this.render()
    } catch (e) {
      this._dispatch('error', e.message)
    }
  }

  render () {
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!this.file || !validExtensions.includes(this.file.type)) {
      this._dispatch('error', 'Invalid image file.')
      this._clear()
      return
    }

    try {
      this.status = 'loading'
      const fileReader = new FileReader()
      fileReader.addEventListener('load', this.onReaderReady.bind(this))
      fileReader.addEventListener('error', this.onReaderError.bind(this))
      fileReader.readAsDataURL(this.file)
      this.input.files = this.copyFile()
    } catch (e) {
      this._clear()
      this._dispatch('error', e.message)
    }
  }

  copyFile () {
    const dt = new DataTransfer()
    dt.items.add(new File([this.file.size, this.file.type], this.file.name))
    return dt.files
  }

  onReaderReady (event) {
    const fileURL = event.target.result
    this.style.backgroundImage = `url(${fileURL})`
    this.base64Data = fileURL
    this.setAttribute('status', 'ready')
    this.status = 'ready'
    this._dispatch('success', { source: this.source })
  }

  onReaderError (event) {
    this._dispatch('error', event.target.error)
    this.status = 'error'
  }

  _dispatch (eventName, details) {
    const event = new CustomEvent(eventName, {
      cancelable: true,
      bubbles: true,
      detail: details
    })
    this.dispatchEvent(event)
  }

  _clear () {
    this.file = null
    this.style.backgroundImage = ''
    this.setAttribute('status', 'empty')
    this.input.files = []
  }

  clear () {
    this._clear()
    this._dispatch('clear')
  }

  connectedCallback () {
    this.addEventListener('click', this.onClick.bind(this))
    this.addEventListener('dragover', this.onDragOver.bind(this))
    this.addEventListener('drop', this.onDrop.bind(this))
    this.addEventListener('dragleave', this.onDragLeave.bind(this))
    this.input.addEventListener('change', this.onChange.bind(this))
    if (this.getAttribute('disable-clipboard') !== 'true') {
      window.addEventListener('paste', this.onPaste.bind(this))
    }
  }
}

customElements.define('image-preview', ImagePreview)
