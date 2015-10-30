Template.options.onRendered(function () {
    $('.password-error.modal, .password-success.modal').modal({
        closable  : false
    });
});

Template.options.events({
    'click #page-options .email-add': function(e) {
        var column = $('<div class="column">');
        $('#page-options .emails').append(column);
        UI.render(Template.emailLine, column.get(0));
    },
    'click #page-options .password-update': function(e) {
        var oldPassword = $('#page-options [name="password-old"]').val(),
            newPassword = $('#page-options [name="password-new"]').val();

        Meteor.call('changePassword', oldPassword, newPassword,
                function (error, result) {
            if (error) {
                $('.password-error.modal').last().modal('show');
            } else if (result.passwordChanged === true) {
                $('.password-success.modal').last().modal('show');
            }
        });
    },
    'click #page-options .button-container .update': function(e) {
        var root       = $('#page-options'),
            username   = root.find('[name="username"]').val(),
            firstname  = root.find('[name="firstname"]').val(),
            lastname   = root.find('[name="lastname"]').val(),
            emailLines = root.find('[name="email"]'),
            emails     = [];

        emailLines.each(function () {
            var content = $(this).val();
            if (content) {
                emails.push(content);
            }
        });

        if (emails.length <= 0) {
            $('.email-error.modal').last().modal('show');
            return;
        }

        Meteor.call('updateAccount', username, firstname, lastname, emails);
        //Meteor.call('update')...
        /*
         Dans cette fonction il va falloir vérifier les mails.
         Si des mails ont étés ajoutés/modifiés il faut les checker...
         Utiliser la fct Accounts.sendVerificationEmail

         Aussi, quand l'utilisateur créer une room avec un email qui n'existe pas
         Faire appel à Accounts.sendEnrollmentEmail
        */
    }
});