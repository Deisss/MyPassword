/**
 * Some usefull functions we need threw applications.
*/
Acl = {
    /**
     * Check if user can edit the current vault. Only the owner of the
     * vault can do that.
     *
     * @param {Object} vault                The vault to check
     * @param {Object | String} user        The user requesting access
     * @return {Boolean}                    True he/she can, false not
    */
    canEditVault: function (vault, user) {
        if (!user || !vault) {
            return false;
        }
        if (user.hasOwnProperty('_id')) {
            return vault.ownerId === user._id;
        } else {
            return vault.ownerId === user;
        }
    },

    /**
     * Check if user can add a site to the vault. Owner can do it, others
     * need special grant for this.
     *
     * @param {Object} vault                The vault to check
     * @param {Object} user                 The user requesting access
     * @return {Boolean}                    True he/she can, false not
    */
    canAddSite: function(vault, user) {
        if (!user || !vault) {
            return false;
        }
        if (vault.ownerId === user._id) {
            return true;
        } else {
            // We search if user is allowed to create a site
            var emails = _.pluck(user.emails, 'address');

            for (var i = 0, l = vault.users.length; i < l; ++i) {
                if (_.contains(emails, vault.users[i].email)) {
                    return vault.users[i].create;
                }
            }

            // nothing found, we select the "else" case
            return false;
        }
    },

    /**
     * Check if user can edit a site from the vault. Owner can do it, others
     * need special grant for this.
     *
     * @param {Object} vault                The vault to check
     * @param {Object} user                 The user requesting access
     * @return {Boolean}                    True he/she can, false not
    */
    canEditSite: function (vault, user) {
        if (!user || !vault) {
            return false;
        }

        if (vault.ownerId === user._id) {
            return true;
        } else {
            // We search if user is allowed to edit a site
            var emails = _.pluck(user.emails, 'address');

            for (var i = 0, l = vault.users.length; i < l; ++i) {
                if (_.contains(emails, vault.users[i].email)) {
                    return vault.users[i].update;
                }
            }

            // nothing found, we select the "else" case
            return false;
        }
    },

    /**
     * Check if user can delete a site from the vault. Owner can do it, others
     * need special grant for this.
     *
     * @param {Object} vault                The vault to check
     * @param {Object} user                 The user requesting access
     * @return {Boolean}                    True he/she can, false not
    */
    canDeleteSite: function (vault, user) {
        if (!user || !vault) {
            return false;
        }

        if (vault.ownerId === user._id) {
            return true;
        } else {
            // We search if user is allowed to edit a site
            var emails = _.pluck(user.emails, 'address');

            for (var i = 0, l = vault.users.length; i < l; ++i) {
                if (_.contains(emails, vault.users[i].email)) {
                    return vault.users[i].delete;
                }
            }

            // nothing found, we select the "else" case
            return false;
        }
    }
};