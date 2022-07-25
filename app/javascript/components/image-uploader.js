class ImageUploader {
  onUpdatePreview(event) {
    this.preview.src = event.target.result;
  }

  onChange() {
    if (this.input.files && this.input.files[0]) {
      let reader = new FileReader();
      reader.addEventListener('load', this.onUpdatePreview.bind(this));
      reader.readAsDataURL(this.input.files[0]);
    }
  }

  constructor(element) {
    this.preview = element.querySelector('img');
    this.input = element.querySelector('input');
    this.input.addEventListener('change', this.onChange.bind(this));

    window.setTimeout(_ => {
      let previewContainer = element.querySelector('.preview');
      let rect = previewContainer.getBoundingClientRect();
      this.preview.style.width = rect.width + 'px';
      this.preview.style.height = rect.height + 'px';
      this.preview.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII= ';
    }, 1);
  }
}

document.addEventListener('turbolinks:load', _ => {
  let uploaders = document.querySelectorAll('.image-uploader');
  for (let uploader of uploaders) {
    new ImageUploader(uploader);
  }
});