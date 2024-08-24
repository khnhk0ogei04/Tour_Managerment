tinymce.init({
    selector: 'textarea[textarea-mce]',
    plugins: 'image',
    image_title: true,
    automatic_uploads: true,
    file_picker_types: 'image',
    images_upload_url: '/admin/upload'
  });