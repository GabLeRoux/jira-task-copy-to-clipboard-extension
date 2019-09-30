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
    var issueId, issueTitle;
    if (isLegacy()) {
        issueId = $("#key-val").data('issue-key');
        issueTitle = $("#summary-val").text();
    } else {
        issueId = $("#jira-issue-header a.css-1i1hrbk span.css-eaycls").text();
        issueTitle = $("#helpPanelContainer h1.sc-duVqjH.lmSsxY").text();
    }
    return issueId + " " + issueTitle;
}

function createCopyButton() {
    if (isLegacy()) {
        return $("<h1 id='copy-issue' title='Copy issue key and title' class='aui-button toolbar-trigger issueaction-custom-copy'><span class='trigger-label'>Copy</span></h1>");
    } else {
        return $("<a id='copy-issue' title='Copy issue key and title' class='aui-button toolbar-trigger issueaction-custom-copy'><span class='trigger-label'>Copy</span></a>");
    }
}

function isLegacy() {
    return $('.aui-page-header-main').length >= 1
}

function getDestination() {
    if (isLegacy()) {
        return $("#stalker .aui-nav.aui-nav-breadcrumbs");
    } else {
        return $("#jira-issue-header .BreadcrumbsContainer-tgj96-0.eiYreW");
    }
}

function attachCopyButton() {
    var copyButton = createCopyButton();
    copyButton.click(function () {
        copyAction();
    });
    var destination = getDestination();
    destination.append(copyButton);
}

function copyAction() {
    var text = getTextToCopy();
    copyTextToClipboard(text);
    console.log("[jira-task-copy-to-clipboard] copied '" + getTextToCopy() + "' to clipboard");
}

function injectButton() {
    var textToCopy = getTextToCopy();
    console.log("[jira-task-copy-to-clipboard] " + textToCopy);
    attachCopyButton();
    console.log("[jira-task-copy-to-clipboard] injected copy button");
}

chrome.extension.sendMessage({}, function (response) {
    // TODO: improve this, it's not very efficient but it works
    setInterval(function () {
        if ($('#copy-issue').length < 1) {
            injectButton();
        }
    }, 100);
});

