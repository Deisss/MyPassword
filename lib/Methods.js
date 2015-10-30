(function() {
    function searchVaults(userId, optionalId) {
        var user = Meteor.users.findOne(userId),
            emails = _.pluck(user.emails, 'address');

        // Building options
        var options = {
            deletedAt: null,
            $or: [
                {
                    ownerId: userId
                },
                {
                    users: {
                        $elemMatch: {
                            email: {
                                $in: emails
                            }
                        }
                    }
                }
            ]
        };

        var restrict = {
            createdAt: 0,
            updatedAt: 0,
            deletedAt: 0
        };

        if (optionalId) {
            options['_id'] = optionalId;
        }

        return Vaults.find(options, restrict);
    }

    Meteor.methods({
        addVault: function (icon, title, users) {
            if (!Meteor.userId()) {
                Router.go('/sign-in');
                throw new Meteor.Error('not-authorized');
            }

            icon = icon || 'user';
            title = title || '';

            return Vaults.insert({
                icon: icon,
                title: title,
                users: users,
                search: title.toLowerCase(),
                ownerId: Meteor.userId()
            });
        },

        editVault: function (id, icon, title, users) {
            if (!Meteor.userId()) {
                Router.go('/sign-in');
                throw new Meteor.Error('not-authorized');
            }

            icon = icon || 'user';
            title = title || '';

            return Vaults.update({
                _id: id,
                ownerId: Meteor.userId(),
                deletedAt: null
            }, {
                $set: {
                    icon: icon,
                    title: title,
                    search: title.toLowerCase(),
                    users: users
                }
            });
        },

        deleteVault: function (id) {
            if (!Meteor.userId()) {
                Router.go('/sign-in');
                throw new Meteor.Error('not-authorized');
            }

            var vault = Vaults.findOne({
                _id: id,
                ownerId: Meteor.userId()
            });

            if (!vault) {
                throw new Meteor.Error('not-linked');
            }

            return Vaults.update(vault._id, {
                $set: {
                    deletedAt: new Date()
                }
            });
        },

        addSite: function (vaultId, icon, title, url, accounts, keys, note) {
            if (!Meteor.userId()) {
                Router.go('/sign-in');
                throw new Meteor.Error('not-authorized');
            }

            var data   = searchVaults(Meteor.userId(), vaultId),
                vaults = data.fetch(),
                user   = Meteor.users.findOne(Meteor.userId());

            // User is allowed to see the content of this vault
            if (vaults.length === 1 && Acl.canAddSite(vaults[0], user)) {
                icon = icon || 'user';
                title = title || '';
                url = url || '';
                note = note || '';

                return Sites.insert({
                    icon: icon,
                    title: title,
                    search: title.toLowerCase(),
                    url: url,
                    accounts: accounts,
                    keys: keys,
                    note: note,
                    vaultId: vaultId,
                    ownerId: Meteor.userId()
                });
            } else {
                throw new Meteor.Error('not-linked');
            }

        },

        editSite: function(vaultId, siteId, icon, title, url, accounts, keys, note) {
            if (!Meteor.userId()) {
                Router.go('/sign-in');
                throw new Meteor.Error('not-authorized');
            }

            var data   = searchVaults(Meteor.userId(), vaultId),
                vaults = data.fetch(),
                vault  = null,
                user   = Meteor.users.findOne(Meteor.userId());

            if (vaults.length !== 1) {
                throw new Meteor.Error('not-linked');
            } else {
                if (!Acl.canEditSite(vaults[0], user)) {
                    throw new Meteor.Error('not-linked');
                }
                vault = vaults[0];
            }

            var site = Sites.findOne({
                _id: siteId,
                vaultId: vaultId
            });

            if (!site) {
                throw new Meteor.Error('not-linked');
            }

            icon = icon || 'user';
            title = title || '';
            url = url || '';
            note = note || '';

            return Sites.update(siteId, {
                $set: {
                    icon: icon,
                    title: title,
                    search: title.toLowerCase(),
                    url: url,
                    accounts: accounts,
                    keys: keys,
                    note: note
                }
            });
        },

        deleteSite: function (vaultId, siteId) {
            if (!Meteor.userId()) {
                Router.go('/sign-in');
                throw new Meteor.Error('not-authorized');
            }

            var data   = searchVaults(Meteor.userId(), vaultId),
                vaults = data.fetch(),
                vault  = null,
                user   = Meteor.users.findOne(Meteor.userId());

            if (vaults.length !== 1) {
                throw new Meteor.Error('not-linked');
            } else {
                if (!Acl.canEditSite(vaults[0], user)) {
                    throw new Meteor.Error('not-linked');
                }
                vault = vaults[0];
            }

            var site = Sites.findOne({
                _id: siteId,
                vaultId: vaultId
            });

            if (!site) {
                throw new Meteor.Error('not-linked');
            }

            return Sites.update(site._id, {
                $set: {
                    deletedAt: new Date()
                }
            });
        },


        updateAccount: function(username, firstname, lastname, emails) {
            if (!Meteor.userId()) {
                Router.go('/sign-in');
                throw new Meteor.Error('not-authorized');
            }

            var user = Meteor.users.findOne({
                _id: Meteor.userId()
            });

            if (!user) {
                throw new Meteor.Error('not-linked');
            }

            var originalEmails = user.emails,
                email          = null,
                existingEmails = _.pluck(originalEmails, 'address'),
                resultEmails   = [];

            var i = emails.length;
            while (i--) {
                email = emails[i].toLowerCase();

                var verified = false;
                if (_.contains(existingEmails, email)) {
                    for (var j = 0, k = originalEmails.length; j < k; ++j) {
                        if (originalEmails[j].address === email) {
                            verified = originalEmails[j].verified;
                            break;
                        }
                    }

                // The email is not in the current existing email list
                // so we search for it...
                } else {
                    var tmpUser = Meteor.users.findOne({
                        email: email
                    });

                    // Error... The email should not be listed
                    if (tmpUser) {
                        emails.slice(i, 1);
                    }
                }

                resultEmails.push({
                    address: email,
                    verified: verified
                });
            }

            return Meteor.users.update(user._id, {
                $set: {
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    emails: resultEmails
                }
            })
        },
    });

    if (Meteor.isServer) {
        Meteor.methods({
            signout: function() {
                if (!Meteor.userId()) {
                    Router.go('/sign-in');
                    throw new Meteor.Error('not-authorized');
                }

                return Meteor.users.update({
                    '_id': Meteor.userId()
                }, {
                    $set : {
                        'services.resume.loginTokens' : []
                    }
                });
            },
            fetchUrl: function (url) {
                if (!Meteor.userId()) {
                    Router.go('/sign-in');
                    throw new Meteor.Error('not-authorized');
                }

                var result = Meteor.http.get(url, {timeout: 20000});

                if (result.statusCode == 200) {
                    var cheerio = Meteor.npmRequire('cheerio'),
                        parser = Npm.require('url'),
                        $ = cheerio.load(result.content);

                    var favicon = $('link[rel="shortcut icon"]').attr('href') ||
                            $('link[rel="icon"]').attr('href') ||
                            $('link[rel="apple-touch-icon"]').attr('href') ||
                            $('link[rel="apple-touch-icon-precomposed"]').attr(
                                    'href');

                    // Manually catch the favicon if nothing specified
                    if (!favicon) {
                        var t = parser.parse(url);
                        favicon = t.protocol + '//' + t.hostname + '/favicon.ico';
                    }

                    var title = $('title').text();

                    return {
                        favicon: favicon,
                        title: title
                    };
                } else {
                    throw new Meteor.Error(result.statusCode);
                }
            }
        });
    }

})();