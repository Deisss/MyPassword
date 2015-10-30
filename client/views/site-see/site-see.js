Template.siteSee.events({
    'click .site-edit': function (e) {
        Router.go('siteEdit', {
            _id: Router.current().params._id,
            _sId: Router.current().params._sId
        });
    },
    'click .reveal-password': function(e) {
        $(e.target).closest('.description').find('.password-field').show();
        $(e.target).hide();
    },
    'click .reveal-key': function(e) {
        var description = $(e.target).closest('.description'),
            title       = description.find('.key-title').text(),
            content     = description.find('.key-content').text(),
            modal       = $('.key-revealer.modal').last();

        modal.find('.key-title').html(title);
        modal.find('.key-content').html(content);
        modal.modal('show');
    }
});

(function () {
    var register = false;
    if (typeof UI !== 'undefined' && !register) {
        register = true;
        UI.registerHelper('encode', function (url) {
            return encodeURI(url);
        });
        UI.registerHelper('prettyAccount', function (title) {
            return title || 'Account';
        });
        UI.registerHelper('prettyKey', function (title) {
            return title || 'Key';
        });
    }
})();