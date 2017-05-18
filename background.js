/* Define EditableContentBg Module */

var EditableContentBg = (function() {
    var init,
        toggleEditable,
        tabChanged,
        onUpdated,
        onRemoved,

        _activatedTabs = [],
        _injectedTabs = [];

    /**
     * onUpdated
     *
     * Changes the icon state on tab refresh
     *
     * @param   {int}    tabId - id of the refreshed tab
     * @param   {Object} info  - includes status informations
     **/
    onUpdated = function(tabId, info) {
        var index = _activatedTabs.indexOf(tabId),
            injectedIndex = _injectedTabs.indexOf(tabId);

        if(info.status === "loading" && index >= 0) {
            _activatedTabs.splice(index, 1);
            _injectedTabs.splice(injectedIndex, 1);
            chrome.tabs.executeScript(null, {code: '_EditableContent.remove()'});
            chrome.browserAction.setIcon({path: 'icon.png'});
        }
    };

    /**
     * onRemoved
     *
     * Removes tab from active tabs array when tab closes
     *
     * @param {int} tabId - id of the closed tab
     **/
    onRemoved = function(tabId) {
        var index = _activatedTabs.indexOf(tabId),
            injectedIndex = _injectedTabs.indexOf(tabId);

        if(index >= 0) {
            _activatedTabs.splice(index, 1);
            _injectedTabs.splice(injectedIndex, 1);
        } else if (injectedIndex >= 0) {
            _injectedTabs.splice(injectedIndex, 1);
        }
    };

    /**
     * tabChanged
     *
     * Checks if the plugin was enabled earlier and
     * sets the correct icon
     *
     * @param {Object} tab - current tab object
     **/
    tabChanged = function(tab) {
        var index = _activatedTabs.indexOf(tab.tabId);
        if(index >= 0) {
            chrome.browserAction.setIcon({path: 'icon-active.png'});
        } else {
            chrome.browserAction.setIcon({path: 'icon.png'});
        }
    };

    /**
     * toggleEditable
     *
     * Toggles contenteditable value on the current page
     * by injecting content.js
     *
     * @param {Object} tab - current tab object
     **/
    toggleEditable = function(tab) {
        var tabId = tab.id,
            index = _activatedTabs.indexOf(tabId);

        if(index < 0) {
            var injected = (_injectedTabs.indexOf(tabId) >= 0);

            if(injected) {
                chrome.tabs.executeScript(null, {code: '_EditableContent.enable();'});
            } else {
                chrome.tabs.executeScript(null, {file: "content.js"});
                _injectedTabs.push(tabId);
            }

            _activatedTabs.push(tab.id);
            chrome.browserAction.setIcon({path: 'icon-active.png'});
        } else {
            _activatedTabs.splice(index, 1);
            chrome.tabs.executeScript(null, {code: '_EditableContent.remove()'});
            chrome.browserAction.setIcon({path: 'icon.png'});
        }
    };

    /**
     * init
     *
     * Sets browserAction and tabs events
     **/
    init = function() {
        chrome.browserAction.onClicked.addListener(toggleEditable);
        chrome.tabs.onUpdated.addListener(onUpdated);
        chrome.tabs.onRemoved.addListener(onRemoved);
        chrome.tabs.onActivated.addListener(tabChanged);
    };

    return {
        init: init
    };
})();

EditableContentBg.init();
