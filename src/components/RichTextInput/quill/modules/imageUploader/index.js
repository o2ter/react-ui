import LoadingImage from './image.js';

export class ImageUploader {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.range = null;
    this.placeholderDelta = null;

    var toolbar = this.quill.getModule('toolbar');
    if (toolbar) {
      toolbar.addHandler('image', this.selectLocalImage.bind(this));
    }

    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);

    this.quill.root.addEventListener('drop', this.handleDrop, false);
    this.quill.root.addEventListener('paste', this.handlePaste, false);
  }

  selectLocalImage() {
    this.quill.focus();
    this.range = this.quill.getSelection();
    this.fileHolder = document.createElement('input');
    this.fileHolder.setAttribute('type', 'file');
    this.fileHolder.setAttribute('accept', 'image/*');
    this.fileHolder.setAttribute('style', 'visibility:hidden');

    this.fileHolder.onchange = this.fileChanged.bind(this);

    document.body.appendChild(this.fileHolder);

    this.fileHolder.click();

    window.requestAnimationFrame(() => {
      document.body.removeChild(this.fileHolder);
    });
  }

  handleDrop(evt) {
    if (
      evt.dataTransfer &&
      evt.dataTransfer.files &&
      evt.dataTransfer.files.length
    ) {
      evt.stopPropagation();
      evt.preventDefault();
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(evt.clientX, evt.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(
            range.startContainer,
            range.startOffset,
            range.startContainer,
            range.startOffset
          );
        }
      } else {
        const selection = document.getSelection();
        const range = document.caretPositionFromPoint(evt.clientX, evt.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(
            range.offsetNode,
            range.offset,
            range.offsetNode,
            range.offset
          );
        }
      }

      this.quill.focus();
      this.range = this.quill.getSelection();
      let file = evt.dataTransfer.files[0];

      setTimeout(() => {
        this.quill.focus();
        this.range = this.quill.getSelection();
        this.readAndUploadFile(file);
      }, 0);
    }
  }

  handlePaste(evt) {
    let clipboard = evt.clipboardData || window.clipboardData;

    // IE 11 is .files other browsers are .items
    if (clipboard && (clipboard.items || clipboard.files)) {
      let items = clipboard.items || clipboard.files;
      for (let i = 0; i < items.length; i++) {
        const IMAGE_MIME_REGEX = /^image\/(jpe?g|gif|png|svg|webp)$/i;
        if (IMAGE_MIME_REGEX.test(items[i].type)) {
          let file = items[i].getAsFile ? items[i].getAsFile() : items[i];

          if (file) {
            this.quill.focus();
            this.range = this.quill.getSelection();
            evt.preventDefault();
            setTimeout(() => {
              this.quill.focus();
              this.range = this.quill.getSelection();
              this.readAndUploadFile(file);
            }, 0);
          }
        }
      }
    }
  }

  readAndUploadFile(file) {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.addEventListener(
      'load',
      () => { this.insertBase64Image(fileReader.result); },
      false
    );
    fileReader.readAsDataURL(file);
  }

  fileChanged() {
    const file = this.fileHolder.files[0];
    this.readAndUploadFile(file);
  }

  insertBase64Image(url) {
    const range = this.range;

    this.placeholderDelta = this.quill.insertEmbed(
      range.index,
      LoadingImage.blotName,
      `${url}`,
      'user'
    );
  }
}
