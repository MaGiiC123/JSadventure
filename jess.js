var prompttext = "";
var tickRate = 60;
var promptHistory = [''];
var inHistory = false;
var historyCount = 1;

window.onload = function() {	
	generateInputfield();
	listenForInput();
	setInterval(mainLoop, 1000/tickRate);
};

function mainLoop() {
	prompttext = document.getElementById('commandinput').value;

}

function listenForInput() {
	document.getElementById('commandinput').addEventListener('keyup', function(event) {
		if (event.key === "Enter") {
			inHistory = false;
			historyCount = 1;

			interpretInput(prompttext);
			document.getElementById("textarea").innerHTML += prompttext+"\n";
			
			promptHistory.push(prompttext.replace("> ", ""));
			document.getElementById('commandinput').value = "> ";
		}
		if (event.key === "Delete" || event.key === "Backspace") {
			if (prompttext === "> " || prompttext === ">" || prompttext === "")
				document.getElementById('commandinput').value = "> ";
		}
		if (event.key === "ArrowUp") {
			if(inHistory == true) {
				historyCount++;				
			}
			setPrompttext(promptHistory[promptHistory.length - historyCount]);
			inHistory = true;
		}
	});
}

function generateInputfield() {
	document.getElementById("place").innerHTML += "<input type='text' id='commandinput' value='> add '  style = 'color:white' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false'  />";
	setFocus();
}

function setPrompttext(_text) {
	document.getElementById("commandinput").value = "> "+_text;
	setFocus();
}

function setFocus() {
	var xxxinput = document.getElementById('commandinput');
	setCaretPosition(xxxinput, xxxinput.value.length);
}

function setCaretPosition(ctrl, pos) {
	// Modern browsers
	if (ctrl.setSelectionRange) {
		ctrl.focus();
		ctrl.setSelectionRange(pos, pos);
		// IE8 and below
	} else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}

function interpretInput(input) {
	var _input = [];
	_input = input.replace("> ", "").split(" ");
	
	for (var i = 0; i <= Object.keys(RegisteredCommands).length; i++) {
		if (_input[0] == RegisteredCommands.properties[i].name) {
			if(RegisteredCommands.properties[i].parameter == true) {
				RegisteredCommands.properties[i].value(_input);
			}
			else {
				RegisteredCommands.properties[i].value();
			}
		}
	}
	
}

function clearConsoleLog() {
	document.getElementById("textarea").innerHTML = "";
}

function add(args) {
	var sum = 0;
	args.forEach(element => {
		if(!parseFloat(element))
			return;
		sum += parseFloat(element);
	});
	document.getElementById("textarea").innerHTML += "sum: " + sum + "\n";
}

var RegisteredCommands = {
	properties: {
		0: {name: "clear", value: function() { clearConsoleLog(); }, parameter: false},
		1: {name: "add", value: function(input) { add(input); }, parameter: true}
	}
};

function LoadNewPage(link) {
	document.location.href = link;
}