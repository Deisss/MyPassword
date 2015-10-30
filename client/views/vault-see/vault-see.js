Template.vaultSee.helpers({
    vault: function() {
        return Vaults.findOne({
            _id: Router.current().params._id
        });
    },
    sites: function() {
        return Sites.find({
            vaultId: Router.current().params._id
        }, {
            sort: [['search', 'asc']]
        });
    },
    site: function() {
        return Sites.findOne({
            _id: Router.current().params._sId,
            vaultId: Router.current().params._id
        });
    }
});

Template.vaultSee.events({
    'click .site-add': function(e) {
        Router.go('siteCreate', {
            _id: Router.current().params._id
        });
    }
});

(function () {
    var register = false;
    if (typeof UI !== 'undefined' && !register) {
        register = true;
        UI.registerHelper('prettyIcon', function (url) {
            var content;
            if (url &&
                    (url.indexOf('http') !== -1 || url.indexOf('/') !== -1)) {
                content = '<img class="ui image" src="' + url +
                        '" alt="icon" />';
            } else {
                content = '<i class="' + url + ' icon"></i>';
            }
            return new Handlebars.SafeString(content);
        });
    }
})();