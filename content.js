var _EditableContent = {
    enable: function() {
        document.body.setAttribute('contenteditable', true);
    },

    remove: function() {
        document.body.removeAttribute('contenteditable');
    }
};

_EditableContent.enable();
