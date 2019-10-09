var prompttext = "";
var tickRate = 60;
var promptHistory = [];
var inHistory = false;
var historyCount = 1;
var tabThroughCompletionList = false;
var tabCompletionCount = 1;

window.onload = function() {
	generateInputfield();
	generateTextarea();
	listenForInput();
	setInterval(mainLoop, 1000/tickRate);

	$(document).keydown(function(e) {		
		if (e.key === "Tab") {
			e.preventDefault();
			setFocus();

		}
	});
};

function mainLoop() {
	prompttext = document.getElementById('commandinput').value;

}

function listenForInput() {
	document.getElementById('commandinput').addEventListener('keyup', function(event) {
		if (event.key === "Enter") {
			inHistory = false;
			historyCount = 1;
			tabThroughCompletionList = false;
			tabCompletionCount = 1;

			interpretInput(prompttext);
			//show command in console //document.getElementById("textarea").innerHTML += prompttext+"\n";			
			promptHistory.push(prompttext.replace("> ", ""));
			document.getElementById('commandinput').value = "> ";
		}
		else if (event.key === "Delete" || event.key === "Backspace") {
			if (prompttext === "> " || prompttext === ">" || prompttext === "")
				document.getElementById('commandinput').value = "> ";
		}
		else if (event.key === "ArrowUp") {
			if (historyCount <= promptHistory.length) {
				if(inHistory == true) {
					historyCount++;				
				}
				setPrompttext(promptHistory[promptHistory.length - historyCount]);
				inHistory = true;
			}
			else {
				setFocus();
			}
		}
		else if (event.key === "ArrowDown") {
			if(inHistory == true) {
				historyCount--;
				if (historyCount <= 0) {
					historyCount = 0;
				}
			}
			if (historyCount <= promptHistory.length) {
				setPrompttext(promptHistory[promptHistory.length - historyCount]);
				inHistory = true;
			}
			console.log('promptHistorylegth: ' + promptHistory.length + ' historyCount: ' + historyCount);
		}
		else if (event.key === "Tab") {
			tabCompletion();
			setFocus();
		}
	});
}

function generateInputfield() {
	document.getElementById("place").innerHTML += "<input type='text' id='commandinput' value='> add '  style = 'color:white' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false'  />";
	setFocus();
}

function generateTextarea() {
	document.getElementById("place").innerHTML += "<textarea name='item3' cols='50' rows='10' readonly='true' id='textarea'></textarea>";
}

function setPrompttext(_text) {
	if (_text == undefined)	{
		_text = "";
	}
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
	
	for (var i = 0; i < Object.keys(RegisteredCommands.properties).length; i++) {
		//check for a full string equivalent
		if (RegisteredCommands.properties[i].name.includes(_input[0]) || RegisteredCommands.properties[i].name[0].includes(_input[0])) {
			if(RegisteredCommands.properties[i].parameter == true)
				RegisteredCommands.properties[i].value(_input);
			else
				RegisteredCommands.properties[i].value();
		}
	}
}

function tabCompletion() {
	var completionList = [];
	for (var i = 0; i < Object.keys(RegisteredCommands.properties).length; i++) {
		var _prompttext = [];
		_prompttext = prompttext.replace("> ", "").split(" ");
		
		if (_prompttext[0].substring(0,1) ==  RegisteredCommands.properties[i].name[0].substring(0,1)) {
			completionList.push(RegisteredCommands.properties[i].name[0]);
			setPrompttext(RegisteredCommands.properties[i].name[0]);
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
	//document.getElementById("textarea").innerHTML += "\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"sum: " + sum + "\n";
	document.getElementById("textarea").innerHTML += "sum: " + sum + "\n";
	//24 \n
}

function subtract(args) {
	if (args == undefined || args[0] == undefined) return;

	var sum;
	var flip = true;
	args.forEach(element => {
		if (flip == true) {
			flip = false;
			return;
		}		
		if (sum == undefined) {
			sum = args[1];
			return;
		}
		if(!parseFloat(element))
			return;
		sum -= parseFloat(element);
	});
	document.getElementById("textarea").innerHTML += "sum: " + sum + "\n";
}

var RegisteredCommands = {
	properties: {
		0: {name: ["clear"], value: function() { clearConsoleLog(); }, parameter: false},
		1: {name: ["add"], value: function(input) { add(input); }, parameter: true},
		2: {name: ["subtract"], value: function(input) { subtract(input); }, parameter: true},
		3: {name: ["divide"], value: function(input) { divi(input); }, parameter: true},
		4: {name: ["subivide"], value: function(input) { divi(input); }, parameter: true}
	}
};

function LoadNewPage(link) {
	document.location.href = link;
}

function divi(args) {
	for (var i = 2; i < args.length; i++) {
		args[1] = parseFloat(args[1]) / parseFloat(args[i]);
	}
	document.getElementById("textarea").innerHTML += "sum: " + args[1] + "\n";
}