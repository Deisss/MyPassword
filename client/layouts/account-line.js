Template.accountLine.events({
    'click h6 a': function(e) {
        $(e.target).closest('.account-line').remove();
    } 
});