Template.siteEdit.onRendered(function () {
    $('.ui.dropdown').dropdown();
    $('.site-delete.modal').modal({
        closable  : false,
        onApprove : function() {
            Meteor.call('deleteSite', Router.current().params._id,
                    Router.current().params._sId, function (error, result){
                Router.go('vaultSee', {
                    _id: Router.current().params._id
                });
            });
        }
    });
});

Template.siteEdit.events({
    // MARKDOWN
    'click .markdown-icons .mdbold': function (e) {
        $('#markdown-note').mdBold();
    },
    'click .markdown-icons .mditalic': function (e) {
        $('#markdown-note').mdItalic();
    },
    'click .markdown-icons .mdh1': function (e) {
        $('#markdown-note').mdHeader({number: 1});
    },
    'click .markdown-icons .mdh2': function (e) {
        $('#markdown-note').mdHeader({number: 2});
    },
    'click .markdown-icons .mdh3': function (e) {
        $('#markdown-note').mdHeader({number: 3});
    },
    'click .markdown-icons .mdlink': function (e) {
        $('#markdown-note').mdLink({default_url: prompt('Enter URL please')});
    },
    'click .markdown-icons .mdcode': function (e) {
        $('#markdown-note').mdCode();
    },
    'click .markdown-icons .mdquote': function (e) {
        $('#markdown-note').mdQuote();
    },
    'click .markdown-icons .mdunordered': function (e) {
        $('#markdown-note').mdBulletList();
    },
    'click .markdown-icons .mdordered': function (e) {
        $('#markdown-note').mdNumberedList();
    },



    // Other
    'click .rsa-add': function(e) {
        UI.render(Template.rsaLine, $('.rsa-key').get(0));
    },
    'click .account-add': function(e) {
        UI.render(Template.accountLine, $('.accounts').get(0));
    },
    'click .url-fetch': function(e) {
        var url = $('.sub-page input[name="url"]').val();

        if (!url) {
            $('.fetch-empty.modal').last().modal('show');
            return;
        }

        Meteor.call('fetchUrl', url, function (error, result) {
            if (!error) {
                $('.sub-page input[name="title"]').val(result.title);
                $('.sub-page .ui.dropdown .text').html(
                    $('<img>').attr('src', result.favicon)
                );
            } 
        });
    },
    'click .button-container .submit': function(e) {
        $('.site-creator').trigger('submit');
    },
    'click .button-container .delete': function(e) {
        $('.site-delete.modal').last().modal('show');
    },
    'submit .site-creator': function (e) {
        // Extracting data
        var root      = $('.site-creator'),
            iconHtml  = root.find('.ui.dropdown').children('.text').children(),
            icon      = '',
            vaultId   = Router.current().params._id,
            siteId    = Router.current().params._sId,
            url       = root.find('input[name="url"]').val(),
            title     = root.find('input[name="title"]').val(),
            note      = root.find('textarea[name="note"]').val();

        if (iconHtml.prop('tagName') === 'IMG') {
            icon = iconHtml.attr('src');
        } else {
            iconHtml.removeClass('icon');
            icon = iconHtml.attr('class');
        }
        icon = icon || 'user';

        // Extracting Accounts
        var accountLines = root.find('.account-line'),
            accounts = [];

        accountLines.each(function () {
            var line            = $(this),
                accountTitle    = line.find('[name="account-title"]').val(),
                accountLogin    = line.find('[name="account-login"]').val(),
                accountEmail    = line.find('[name="account-email"]').val(),
                accountPassword = line.find('[name="account-password"]').val();

            // If any of them is setted, we consider it valid
            if (accountTitle || accountLogin || accountEmail ||
                    accountPassword) {
                accounts.push({
                    title: accountTitle || '',
                    login: accountLogin || '',
                    email: accountEmail || '',
                    password: accountPassword || ''
                });
            }
        });

        // Extracting RSA/SSH
        var rsaLines = root.find('.rsa-line'),
            keys = [];

        rsaLines.each(function () {
            var line       = $(this),
                rsaTitle   = line.find('[name="rsa-title"]').val(),
                rsaContent = line.find('[name="rsa-content"]').val();

            if (rsaTitle && rsaContent) {
                keys.push({
                    title: rsaTitle,
                    content: rsaContent
                });
            }
        });

        Meteor.call('editSite', vaultId, siteId, icon, title, url, accounts,
                keys, note, function (error, result) {
            if (!error) {
                Router.go('siteSee', {
                    _id: vaultId,
                    _sId: siteId
                });
            }
        });

        return false;
    }
});