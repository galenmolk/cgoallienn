const imageInput = document.getElementById('image_input');
const imageDisplay = document.getElementById('image_display');
const slider = document.getElementById('image_size_slider');
const sliderLabel = document.getElementById('slider_label');

const defaultImageScale = 50;

// Called when the user changes the selected URL of imageInput.
imageInput.onchange = tryPreviewImage;

// Called when imageDisplay finishes loading a new image resource.
imageDisplay.onload = imageLoaded;

// Called every time the slider's value changes.
slider.oninput = sliderMoved;

// Configure the slider and the slider's label to their default values.
initializeElements();

function initializeElements() {
  slider.value = defaultImageScale;
  updateLabelText();
}

function updateLabelText() {
  sliderLabel.innerHTML = getSliderLabelText();
}

function getSliderLabelText() {
  return "Scale: " + slider.value + "%";
}

function imageLoaded() {
  // Reset slider to default position when a new image is loaded.
  slider.value = defaultImageScale;

  scaleImage(defaultImageScale);
  updateLabelText();
}

function scaleImage(percent) {
  // CSS width/height values must be in string format.
  imageDisplay.style.width = percent + "%";
  imageDisplay.style.height = percent + "%";
}

function sliderMoved() {
  scaleImage(this.value);
  updateLabelText();
}

function tryPreviewImage(event) {
  // Assign the first element of the files array to the file variable (with ES6 destructuring). Whatever this is??
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  let [file] = event.target.files;

  // Only create an object URL if file is non-null; i.e. the user actually selected a file.
  if (file) 
      imageDisplay.src = URL.createObjectURL(file);
}
