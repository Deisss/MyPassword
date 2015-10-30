Router.map(function () {
    // Subscription manager
    var subs = new SubsManager({
        // maximum number of cache subscriptions
        cacheLimit: 10,
        // any subscription will be expire after 5 minute,
        // if it's not subscribed again
        expireIn: 5
    });

    function baseSEO(value, callback) {
        var orig = value;
        return function() {
            value = orig;
            if (!Meteor.isClient) {
                return;
            }
            if (callback) {
                try {
                    value += callback.call(this);
                } catch (e) {}
            }
            SEO.set({
                title: value
            });
        };
    }

    // Home
    this.route('home', {
        path: '/',
        action: function () {
            IRLibLoader.load('/js/chart-js.min.js');
            subs.subscribe('user');
            subs.subscribe('vaults');
            this.render();
        },
        onAfterAction: baseSEO('Meteor Password | Welcome')
    });

    // Account details/edit
    this.route('options', {
        path: '/options',
        data: function() {
            return {
                user: Meteor.users.findOne({
                    _id: Meteor.userId()
                }, {
                    limit: 1
                })
            };
        },
        action: function () {
            subs.subscribe('vaults');
            subs.subscribe('user');
            this.render();
        },
        onAfterAction: baseSEO('Meteor Password | My Account')
    });

    // Password generator
    this.route('generator', {
        path: '/generator',
        action: function () {
            IRLibLoader.load('/js/password-generator.js');
            IRLibLoader.load('/js/jquery.complexify.banlist.js');
            IRLibLoader.load('/js/jquery.complexify.min.js');
            subs.subscribe('user');
            subs.subscribe('vaults');
            this.render();
        },
        onAfterAction: baseSEO('Meteor Password | Generator')
    });

    // Create a vault
    this.route('vaultCreate', {
        path: '/vault/create',
        action: function () {
            subs.subscribe('user');
            subs.subscribe('vaults');
            this.render();
        },
        onAfterAction: baseSEO('Meteor Password | New vault')
    });

    // See a vault
    this.route('vaultSee', {
        path: '/vault/:_id',
        template: 'siteSee',
        data: function() {
            return {
                vault: Vaults.findOne({
                    _id: this.params._id
                }, {fields: {title: 1}}),
                site: Sites.findOne({
                    vaultId: this.params._id
                }, {
                    sort: [['search', 'asc']]
                })
            };
        },
        action: function() {
            subs.subscribe('user');
            subs.subscribe('vaults');
            subs.subscribe('vault', this.params._id);
            subs.subscribe('sites', this.params._id);

            // We subscribe tot he first data found in the template
            if (this.data() && this.data().site) {
                subs.subscribe('site', this.params._id, this.data().site._id);
                this.params._sId = this.data().site._id;
            }

            this.render();
        },
        onAfterAction: baseSEO('Meteor Password | ', function () {
            return this.data().vault.title;
        })
    });

    // Edit a vault
    this.route('vaultEdit', {
        path: '/vault/:_id/edit',
        data: function() {
            return {
                vault: Vaults.findOne({
                    _id: this.params._id
                }, {fields: {title: 1}})
            };
        },
        action: function() {
            subs.subscribe('user');
            subs.subscribe('vaults');
            subs.subscribe('vault', this.params._id);
            subs.subscribe('sites', this.params._id);
            this.render();
        },
        onAfterAction: baseSEO('Meteor Password | Edit ', function () {
            return this.data().vault.title;
        })
    });

    // See a site inside a vault
    this.route('siteCreate', {
        path: '/vault/:_id/site/create',
        action: function() {
            IRLibLoader.load('/js/jquery-markdown.js');
            IRLibLoader.load('/js/jquery-markdown.cursor.js');
            subs.subscribe('user');
            subs.subscribe('vaults');
            subs.subscribe('vault', this.params._id);
            subs.subscribe('sites', this.params._id);
            this.render();
        },
        onAfterAction: baseSEO('Meteor Password | Create site')
    });

    // See a site inside a vault
    this.route('siteSee', {
        path: '/vault/:_id/site/:_sId',
        data: function() {
            return {
                vault: Vaults.findOne({
                    _id: this.params._id
                }, {fields: {title: 1}}),
                site: Sites.findOne({
                    _id: this.params._sId,
                    vaultId: this.params._id
                }, {fields: {title: 1}})
            };
        },
        action: function() {
            subs.subscribe('user');
            subs.subscribe('vaults');
            subs.subscribe('vault', this.params._id);
            subs.subscribe('sites', this.params._id);
            subs.subscribe('site', this.params._id, this.params._sId);
            this.render();
        },
        onAfterAction: baseSEO('Meteor Password | ', function () {
            var vault = this.data().vault.title,
                site  = this.data().site.title;

            return vault + ' - ' + site;
        })
    });

    // See a site inside a vault
    this.route('siteEdit', {
        path: '/vault/:_id/site/:_sId/edit',
        data: function() {
            return {
                vault: Vaults.findOne({
                    _id: this.params._id
                }, {fields: {title: 1}}),
                site: Sites.findOne({
                    _id: this.params._sId,
                    vaultId: this.params._id
                }, {fields: {title: 1}})
            };
        },
        action: function() {
            IRLibLoader.load('/js/jquery-markdown.js');
            IRLibLoader.load('/js/jquery-markdown.cursor.js');
            subs.subscribe('user');
            subs.subscribe('vaults');
            subs.subscribe('vault', this.params._id);
            subs.subscribe('sites', this.params._id);
            subs.subscribe('site', this.params._id, this.params._sId);
            this.render();
        },
        onAfterAction: baseSEO('Meteor Password | Edit ', function () {
            var vault = this.data().vault.title,
                site  = this.data().site.title;

            return vault + ' - ' + site;
        })
    });
});




// Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');

// Options
AccountsTemplates.configure({
    //defaultLayout: 'emptyLayout',
    showForgotPasswordLink: true,
    overrideLoginErrors: true,
    enablePasswordChange: true,
    sendVerificationEmail: true,
    enforceEmailVerification: true,

    //confirmPassword: true,
    //continuousValidation: false,
    //displayFormLabels: true,
    //forbidClientAccountCreation: false,
    //formValidationFeedback: true,
    //homeRoutePath: '/',
    //showAddRemoveServices: false,
    //showPlaceholders: true,

    negativeValidation: true,
    positiveValidation:true,
    negativeFeedback: false,
    positiveFeedback:true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',
});





// All routes are private
Router.plugin('ensureSignedIn');