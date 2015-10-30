Template.vaultCreate.onRendered(function () {
    $('.ui.dropdown').dropdown();
    $('.scrollbar').perfectScrollbar();
});

Template.vaultCreate.events({
    'click .submit': function(e) {
        $('.creator').trigger('submit');
    },
    'submit .creator': function(e) {
        var iconStr  = $('.creator .ui.dropdown').dropdown('get').value(),
            iconHtml = $(iconStr);

        iconHtml.removeClass('icon');
        var icon  = iconHtml.attr('class') || 'user',
            title = $('#vault-create-name').val();

        // Extracting users
        var tableUsers = $('table.users tbody').children(),
            users = [];
        tableUsers.each(function () {
            var root = $(this),
                email = root.find('[name="email"]').val();
            if (email) {
                users.push({
                    email: root.find('[name="email"]').val(),
                    create: root.find('[name="create"]').is(':checked'),
                    update: root.find('[name="update"]').is(':checked'),
                    delete: root.find('[name="delete"]').is(':checked')
                });
            }
        });

        Meteor.call('addVault', icon, title, users, function(error, result) {
            if (!error && result) {
                Router.go('vaultSee', {
                    _id: result
                });
            }
        });

        return false;
    },
    'click .user-add': function() {
        UI.render(Template.userLine, $('.users tbody').get(0));
        var root = $('.users tbody').children().last(),
            trash = root.find('.trash.icon');

        trash.on('click', function () {
            trash.off('click');
            root.remove();
        });

        // Starting checkbox
        root.find('.checkbox').checkbox();
    }
});