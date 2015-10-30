Template.vaultEdit.onRendered(function () {
    $('.checkbox').checkbox();
    $('.scrollbar').perfectScrollbar();
    $('.vaul-delete.modal').modal({
        closable  : false,
        onApprove : function() {
            Meteor.call('deleteVault', Router.current().params._id,
                    function (error, result) {
                Router.go('home');
            });
        }
    });
});

Template.vaultEdit.helpers({
    vault: function() {
        return Vaults.findOne({
            _id: Router.current().params._id,
            ownerId: Meteor.userId()
        });
    }
});

Template.vaultEdit.events({
    'click .button.button-update': function(e) {
        $('.creator').trigger('submit');
    },
    'click .button.button-delete': function(e) {
        $('.vaul-delete.modal').last().modal('show');
    },
    'submit .creator': function(e) {
        var id       = Router.current().params._id,
            iconStr  = $('.creator .ui.dropdown').dropdown('get').value(),
            iconHtml = $(iconStr);

        iconHtml.removeClass('icon');
        var icon  = iconHtml.attr('class') || 'user',
            title = $('#vault-edit-name').val();

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

        Meteor.call('editVault', id, icon, title, users,
                function (error, result) {
            if (!error && result) {
                Router.go('vaultSee', {
                    _id: id
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