Template.page.onRendered(function () {
    this.$('.ui.dropdown').dropdown();
    this.$('.ui.accordion').accordion();
    this.$('.scrollbar').perfectScrollbar({
        suppressScrollX: true
    });
});

Template.page.helpers({
    vaults: function() {
        // By default the publich function got everything
        // filtered already
        return Vaults.find({
        }, {
            sort: [['search', 'asc']]
        });
    },
    user: function() {
        return Meteor.users.findOne({
            _id: Meteor.userId()
        });
    }
});

Template.page.events({
    'click #sign-out-link .logout': function (e) {
        Meteor.call('signout');
        window.location.reload();

        // Just in case
        setTimeout(function () {
            window.location.reload();
        }, 2000);

        // Just in case v2
        setTimeout(function () {
            window.location.reload();
        }, 4000);
    },
    'click #sign-out-link .options': function(e) {
        Router.go('options');
    }
});

UI.registerHelper('prettyUser', function (user) {
    if (user && (user.firstname || user.lastname)) {
        return user.firstname + ' ' + user.lastname;
    } else if (user && user.username) {
        return user.username;
    } else if (user && user.emails && user.emails.length > 0) {
        return user.emails[0].address;
    } else {
        return '';
    }
});

UI.registerHelper('equals', function (a, b) {
    return a === b;
});

UI.registerHelper('canEditVault', function (vault) {
    return Acl.canEditVault(vault, Meteor.userId());
});

// Can add a new site
UI.registerHelper('canAddSite', function (vault) {
    return Acl.canAddSite(vault, Meteor.users.findOne(Meteor.userId()));
});

// Can edit/update a site
UI.registerHelper('canEditSite', function (vault) {
    return Acl.canEditSite(vault, Meteor.users.findOne(Meteor.userId()));
});

// Can delete a site
UI.registerHelper('canDeleteSite', function (vault) {
    return Acl.canDeleteSite(vault, Meteor.users.findOne(Meteor.userId()));
});