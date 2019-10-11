var prompttext = "";
var tickRate = 60;
var promptHistory = [];
var inHistory = false;
var historyCount = 1;
var tabThroughCompletionList = false;
var tabCompletionCount = 1;
var defaultPrompt = "> ";
var commandLevelName = "";
let commandLevel = Object.assign({}, RegisteredCommands);

window.onload = function() {
	commandLevel = Object.assign({}, RegisteredCommands);
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
	setFocus();
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

			addConsoleLine(prompttext);
			interpretInput(prompttext);
			//show command in console //document.getElementById("textarea").innerHTML += prompttext+"\n";			
			promptHistory.push(prompttext.replace(commandLevelName+defaultPrompt, ""));
			document.getElementById('commandinput').value = commandLevelName+defaultPrompt;
		}
		else if (event.key === "Delete" || event.key === "Backspace") {
			if (prompttext === commandLevelName+defaultPrompt || prompttext === commandLevelName+defaultPrompt || prompttext === "")
				document.getElementById('commandinput').value = commandLevelName+defaultPrompt;
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
	document.getElementById("commandinput").value = commandLevelName+defaultPrompt + _text;
	setFocus();
}

function addConsoleLine(_text) {
	document.getElementById("textarea").innerHTML = _text + "\n" + document.getElementById("textarea").innerHTML;
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
	_input = input.replace(commandLevelName+defaultPrompt, "").split(" ");
	console.log(commandLevel);
	for (var i = 0; i < Object.keys(commandLevel.properties).length; i++) {
		//check for a full string equivalent
		if (commandLevel.properties[i].name.includes(_input[0]) || commandLevel.properties[i].name[0].includes(_input[0])) {
			if(commandLevel.properties[i].parameter == true)
				commandLevel.properties[i].value(_input);
			else
				commandLevel.properties[i].value();
			return;
		}
	}
	for (var i = 0; i < Object.keys(commandLevel.subcommands).length; i++) {		
		if (commandLevel.subcommands[i].name.includes(_input[0])) {
			commandLevel.subcommands[i].value(commandLevel.subcommands[i].commands);
			console.log(commandLevel.subcommands[i]);
			return;
		}
	}
	console.log("ass");
	//document.getElementById("textarea").innerHTML = "could not interpret the command: " + _input[0] + "\n" + document.getElementById("textarea").innerHTML;
	addConsoleLine("could not interpret the command: " + _input[0]);
}

function tabCompletion() {
	var completionList = [];
	for (var i = 0; i < Object.keys(RegisteredCommands.properties).length; i++) {
		var _prompttext = [];
		_prompttext = prompttext.replace(commandLevelName+defaultPrompt, "").split(" ");
		
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
	addConsoleLine("sum: " + sum);//document.getElementById("textarea").innerHTML += "sum: " + sum + "\n";
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
	addConsoleLine("sum: " + sum);//document.getElementById("textarea").innerHTML += "sum: " + sum + "\n";
}

function exitCommandLevel() {
	console.log(commandLevel);
	changeCommandState(commandLevel.upperLevel);	
}

var previousCommandLevel;
function changeCommandState(_state) {
	console.log(_state);
	if (commandLevel != _state) {
		previousCommandLevel = Object.assign({}, commandLevel);
		commandLevel = Object.assign({}, _state);
		commandLevelName = _state.name;
		addConsoleLine("changed to level: " + _state.name);
	}
}
var RegisteredCommands = {};
var TestSubCommands = {
	name: "TestSubCommands",
	upperLevel: RegisteredCommands,
	properties: {
		0: {name: ["why"], value: function() { subCommandwhy(); }, parameter: false},
		1: {name: ["exit"], value: function() { exitCommandLevel(); }, parameter: false},	
	},
	subcommands: {
		0: {name: "", value: function() {}},
	}
}

RegisteredCommands = {
	name: "RegisteredCommands",
	upperLevel: "",
	properties: {
		0: {name: ["clear"], value: function() { clearConsoleLog(); }, parameter: false},
		1: {name: ["add"], value: function(input) { add(input); }, parameter: true},
		2: {name: ["subtract"], value: function(input) { subtract(input); }, parameter: true},
		3: {name: ["divide"], value: function(input) { divi(input); }, parameter: true},
		4: {name: ["testdivide"], value: function(input) { divi(input); }, parameter: true},
		5: {name: ["exit"], value: function() { exitCommandLevel() } },
	},
	subcommands: {
		0: {name: "TestSubCommands", value: function(input) { changeCommandState(input); }, commands: TestSubCommands}
	}
};



function subCommandwhy() {
	addConsoleLine("why? why you doin this");
}

function LoadNewPage(link) {
	document.location.href = link;
}

function divi(args) {
	for (var i = 2; i < args.length; i++) {
		args[1] = parseFloat(args[1]) / parseFloat(args[i]);
	}
	addConsoleLine("sum: " + args[1]);//document.getElementById("textarea").innerHTML += "sum: " + args[1] + "\n";
}