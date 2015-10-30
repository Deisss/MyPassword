Template.rsaLine.events({
    'click h6 a': function(e) {
        $(e.target).closest('.rsa-line').remove();
    } 
});