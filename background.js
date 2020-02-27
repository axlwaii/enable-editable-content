/* Define EditableContentBg Module */
const browserAPI = browser || chrome;

const EditableContentBg = (() => {
    let init,
        toggleEditable;

    const activatedInTabs = [];

    /**
     * toggleEditable
     *
     * Toggles contenteditable value on the current page
     * by injecting content.js
     *
     * @param {Object} tab - current tab object
     **/
    toggleEditable = function(tab) {
        const tabIndex = activatedInTabs.indexOf(tab.id);
        if (tabIndex >= 0) {
             browserAPI.browserAction.setIcon({tabId: tab.id, path: "icon.png"});
            browserAPI.tabs.executeScript({
                code: 'document.body.removeAttribute("contenteditable");'
            });
            activatedInTabs.splice(tabIndex, 1);
        } else {
             browserAPI.browserAction.setIcon({tabId: tab.id, path: "icon-active.png"});
             browserAPI.tabs.executeScript({
                code: 'document.body.setAttribute("contenteditable", true);'
            });
            activatedInTabs.push(tabIndex);
        }
    };

    /**
     * init
     *
     * Sets browserAction and tabs events
     **/
    init = function() {
        browserAPI.browserAction.onClicked.addListener(toggleEditable);
    };

    return {
        init: init
    };
})();

EditableContentBg.init();
