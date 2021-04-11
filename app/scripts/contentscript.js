function copyTextToClipboard(text) {
    console.log("[jira-task-copy-to-clipboard] copyTextToClipboard");
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
    console.log("[jira-task-copy-to-clipboard] getTextToCopy");
    var issueId, issueTitle;
    if (isLegacy()) {
        issueId = document.querySelectorAll("#key-val")[0].childNodes[0].nodeValue; //.data('issue-key');
        issueTitle = document.querySelectorAll("#summary-val")[0].childNodes[0].nodeValue;
    } else {
        issueId = document.querySelectorAll("[data-test-id='issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container']")[0].getElementsByTagName("span")[1].innerText;
        issueTitle = issueTitle = document.querySelectorAll('h1[data-test-id="issue.views.issue-base.foundation.summary.heading"]')[0].innerText;
    }
    return issueId + " " + issueTitle;
}

function createCopyButton() {
    console.log("[jira-task-copy-to-clipboard] createCopyButton");
    let button = document.createElement("span");
    button.setAttribute('id', "copy-issue");
    button.setAttribute('title', "Copy issue key and title");
    button.setAttribute('class', "aui-button toolbar-trigger issueaction-custom-copy");
    let span = document.createElement("span");
    let t = document.createTextNode("Copy issue");
    span.appendChild(t);
    button.appendChild(span);
    return button;
}

function isLegacy() {
    let isLegacy = document.querySelectorAll('.aui-page-header-main').length >= 1;
    console.log("[jira-task-copy-to-clipboard] isLegacy: ", isLegacy);
    return isLegacy;
}

function getDestination() {
    console.log("[jira-task-copy-to-clipboard] getDestination");
    if (isLegacy()) {
        return document.querySelectorAll("#stalker .aui-nav.aui-nav-breadcrumbs")[0];
    } else {
        return document.querySelectorAll("[data-test-id='issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container']")[0];
    }
}

function attachCopyButton() {
    console.log("[jira-task-copy-to-clipboard] attachCopyButton");
    var copyButton = createCopyButton();
    copyButton.addEventListener("click", copyAction);
    var destination = getDestination();
    destination.append(copyButton);
}

function copyAction() {
    const text = getTextToCopy();
    copyTextToClipboard(text);
    console.log("[jira-task-copy-to-clipboard] copied '" + getTextToCopy() + "' to clipboard");
}

function injectButton() {
    console.log("[jira-task-copy-to-clipboard] injectButton");
    const textToCopy = getTextToCopy();
    console.log("[jira-task-copy-to-clipboard] " + textToCopy);
    attachCopyButton();
    console.log("[jira-task-copy-to-clipboard] injected copy button");
}

let delayButtonInjection = function (response) {
    console.log('[jira-task-copy-to-clipboard] delayButtonInjection')
    // TODO: improve this, it's not very efficient but it works
    let intervalHandler = function () {
        console.log('[jira-task-copy-to-clipboard] setInterval')
        if (!document.getElementById('copy-issue')) {
            console.log('[jira-task-copy-to-clipboard] #copy-issue cannot be found, injecting')
            injectButton();
            clearInterval(interval);
        } else {
            console.log('[jira-task-copy-to-clipboard] #copy-issue found')
        }
    };
    let interval = setInterval(intervalHandler, 100);
};
browser.runtime.sendMessage({}, delayButtonInjection);

console.log('[jira-task-copy-to-clipboard] contentscript loaded')
