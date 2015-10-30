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




    // Get all vaults linked to user
    Meteor.publish("vaults", function () {
        if (this.userId) {
            return searchVaults(this.userId);
        }
    });

    // Single vault
    Meteor.publish('vault', function (id) {
        if (this.userId) {
            return searchVaults(this.userId, id);
        }
    });

    // Sites linked to given vault
    Meteor.publish('sites', function (id) {
        if (this.userId) {
            var data   = searchVaults(this.userId, id),
                vaults = data.fetch();

            // User is allowed to see the content of this vault
            if (vaults.length === 1) {
                return Sites.find({
                    vaultId: id,
                    deletedAt: null
                }, {
                    fields: {
                        url: 0,
                        login: 0,
                        email: 0,
                        password: 0,
                        keys: 0,
                        note: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        deletedAt: 0
                    }
                });
            }
        }
    });


    // Single site
    Meteor.publish('site', function (vaultId, siteId) {
        if (this.userId) {
            var data   = searchVaults(this.userId, vaultId),
                vaults = data.fetch();

            // User is allowed to see the content of this vault
            if (vaults.length === 1) {
                return Sites.find({
                    _id: siteId,
                    vaultId: vaultId,
                    deletedAt: null
                }, {
                    fields: {
                        createdAt: 0,
                        updatedAt: 0,
                        deletedAt: 0
                    }
                });
            }
        }
    });
})();


Meteor.publish('user', function () {
    if (this.userId) {
        return Meteor.users.find({
            _id: this.userId
        }, {
            limit: 1
        });
    }
});