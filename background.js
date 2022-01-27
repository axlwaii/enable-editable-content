const browserAPI = chrome;

const css = "body { border: 10px solid red; transition: border; }";

const enableContentEditable = () => {
    document.body.setAttribute("contenteditable", true);
};

const disableContentEditable = () => {
    document.body.removeAttribute("contenteditable");
};

const toggleEditable = async (tab) => {
    const tabId = tab.id;

    const badgeColor = await browserAPI.action.getBadgeBackgroundColor({
        tabId,
    });

    if (badgeColor && badgeColor[1] === 128) {
        browserAPI.action.setIcon({
            tabId: tab.id,
            path: 'icon.png'
        });
        chrome.action.setBadgeBackgroundColor({
            tabId: tab.id,
            color: 'red',
        });
        chrome.scripting.executeScript({ target: { tabId }, function: disableContentEditable });
        browserAPI.scripting.removeCSS({ target: { tabId }, css });
    } else {
        browserAPI.action.setIcon({
            tabId: tab.id,
            path: 'icon-active.png'
        });
        chrome.scripting.executeScript({ target: { tabId }, function: enableContentEditable });
        browserAPI.action.setBadgeBackgroundColor({
            tabId: tab.id,
            color: 'green',
        });
        chrome.scripting.insertCSS({ target: { tabId: tab.id }, css });
    }
};

chrome.action.onClicked.addListener(toggleEditable);
