/* Define EditableContentBg Module */
const browserAPI = browser || chrome;

const CSS = "body { border: 10px solid red; transition: border; }";

const EditableContentBg = (() => {
    let init,
        toggleEditable;

    /**
     * toggleEditable
     *
     * Toggles contenteditable value on the current page
     * by injecting content.js
     *
     * @param {Object} tab - current tab object
     **/
    toggleEditable = async (tab) => {
        const badgeColor = await browserAPI.browserAction.getBadgeBackgroundColor({
            tabId: tab.id,
        });

        if (badgeColor && badgeColor[0] === 0) {
            browserAPI.browserAction.setIcon({
                tabId: tab.id,
                path: 'icon.png'
            });
            browserAPI.browserAction.setBadgeBackgroundColor({
                tabId: tab.id,
                color: 'white',
            });
            browserAPI.tabs.executeScript(tab.id, {
                code: 'document.body.removeAttribute("contenteditable");'
            });
            browser.tabs.removeCSS(tab.id, { code: CSS });
        } else {
            browserAPI.browserAction.setIcon({
                tabId: tab.id,
                path: 'icon-active.png'
            });
            browserAPI.tabs.executeScript(tab.id,{
                code: 'document.body.setAttribute("contenteditable", true);'
            });
            browserAPI.browserAction.setBadgeBackgroundColor({
                tabId: tab.id,
                color: 'black',
            });
            browser.tabs.insertCSS(tab.id, { code: CSS });
        }
    };

    /**
     * init
     *
     * Sets browserAction and tabs events
     **/
    init = () => {
        browserAPI.browserAction.onClicked.addListener(toggleEditable);
    };

    return {
        init: init
    };
})();

EditableContentBg.init();
