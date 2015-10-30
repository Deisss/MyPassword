Template.emailLine.events({
    'click .ui.button': function(e) {
        $(e.target).closest('.email').remove();
    }
});