function copyTextToClipboard(text) {
    //Create a textbox field where we can insert text to.
    var copyFrom = document.createElement("textarea");

    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;

    //Append the textbox field into the body as a child.
    //"execCommand()" only works when there exists selected text, and the text is inside
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);

    //Select all the text!
    copyFrom.select();

    //Execute command
    document.execCommand('copy');

    //(Optional) De-select the text using blur().
    copyFrom.blur();

    //Remove the textbox field from the document.body, so no other JavaScript nor
    //other elements can get access to this.
    document.body.removeChild(copyFrom);
}

function getTextToCopy() {
	return $("#key-val").data('issue-key') + " " + $("#summary-val").text();
}

function createCopyButton() {
	return $("<h1 id='copy-issue' title='Copy issue key and title' class='aui-button toolbar-trigger issueaction-custom-copy'><span class='trigger-label'>Copy</span></h1>");
}

function attachCopybutton() {
	var copyButton = createCopyButton();
	copyButton.click(function() {
		copyAction();
	});
	var destination = $(".aui-page-header-main");
	destination.append(copyButton);
}

function copyAction() {
	copyTextToClipboard(getTextToCopy());
	console.log("[jira-task-copy-to-clipboard] copied '" + getTextToCopy() + "' to clipboard");
}

chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            var textToCopy = getTextToCopy();
			console.log("[jira-task-copy-to-clipboard] " + textToCopy);
			attachCopybutton();
			console.log("[jira-task-copy-to-clipboard] added copy button");
            console.log("[jira-task-copy-to-clipboard] injected");
        }
    }, 10);
});

