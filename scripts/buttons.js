// Cache HTML elements.
const buttonGalen = document.getElementById('button_galen');
const buttonColin = document.getElementById('button_colin');
const buttonCgoallienn = document.getElementById('button_cgoallienn');
const displayText = document.getElementById('display_text');

// Register event listeners. 
buttonGalen.onclick = buttonClicked;
buttonColin.onclick = buttonClicked;
buttonCgoallienn.onclick = buttonClicked;

function buttonClicked(event) {
	// Get the inner HTML of the clicked button as a string.
	let buttonText = event.target.innerHTML;

	// If the display text already equals the button's text, set it to an empty string.
	// Otherwise, set the display text to the button text.
	if (displayText.innerHTML === buttonText)
		clearElementText(displayText);
	else
		setElementText(displayText, buttonText);
}

function setElementText(element, text) {
	element.innerHTML = text;
}

function clearElementText(element) {
	element.innerHTML = '';
}
