if (!Schemas) {
    var Schemas = {};
}

Vaults = new Mongo.Collection('vaults');
Sites = new Mongo.Collection('sites');



/*
-----------------------
  HELPERS
-----------------------
*/
Vaults.helpers({
    owner: function() {
        return Meteor.users.findOne({
            _id: this.ownerId
        });
    },
    sites: function() {
        return Sites.find({
            ownerId: this.ownerId,
            vaultId: this._id
        });
    }
});
Sites.helpers({
    owner: function() {
        return Meteor.users.findOne({
            _id: this.ownerId
        });
    },
    vault: function() {
        return Vaults.findOne({
            _id: this.vaultId,
            ownerId: this.ownerId
        });
    }
});


/*
-----------------------
  SCHEMAS
-----------------------
*/
Schemas.Vault = new SimpleSchema({
    // The vault icon, choosen from semantic ui icons
    icon: {
        type: String,
        label: 'Icon',
        max: 255
    },
    // The vault name
    title: {
        type: String,
        label: 'Title',
        min: 1,
        max: 40
    },
    // Same as title, but lowercase
    search: {
        type: String,
        label: 'Search',
        min: 1,
        max: 40
    },
    ownerId: {
        type: String,
        label: 'Owner',
        index: 1,
        min: 1,
        max: 255
    },
    // Users linked to the vault
    users: {
        type: [Object],
        optional: true
    },
    'users.$.email': {
        type: String,
        label: 'User email',
        max: 255
    },
    'users.$.create': {
        type: Boolean,
        label: 'User can create'
    },
    'users.$.update': {
        type: Boolean,
        label: 'User can update'
    },
    'users.$.delete': {
        type: Boolean,
        label: 'User can delete'
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: new Date()
                };
            } else {
                this.unset();
            }
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    },
    deletedAt: {
        type: Date,
        optional: true
    }
});

Schemas.Site = new SimpleSchema({
    // The site favicon
    icon: {
        type: String,
        label: 'Icon',
        optional: true,
        max: 255
    },
    // The site title
    title: {
        type: String,
        label: 'Title',
        min: 1,
        max: 60
    },
    // Same as title, but lowercase
    search: {
        type: String,
        label: 'Search',
        min: 1,
        max: 60
    },
    // The access url
    url: {
        type: String,
        label: 'Url',
        optional: true,
        max: 255
    },
    accounts: {
        type: [Object],
        optional: true
    },
    // The account title
    'accounts.$.title': {
        type: String,
        optional: true,
        label: 'Account title',
        max: 255
    },
    // The account login
    'accounts.$.login': {
        type: String,
        optional: true,
        label: 'Account login',
        max: 255
    },
    // The account email
    'accounts.$.email': {
        type: String,
        optional: true,
        label: 'Account email',
        max: 255
    },
    // The account password
    'accounts.$.password': {
        type: String,
        optional: true,
        label: 'Account password',
        max: 255
    },
    // The account key (like RSA key, can be alternated with password)
    // Users linked to the vault
    keys: {
        type: [Object],
        optional: true
    },
    'keys.$.title': {
        type: String,
        optional: true,
        label: 'Key title',
        max: 255
    },
    'keys.$.content': {
        type: String,
        optional: true,
        label: 'Key content',
        max: 5000
    },
    // Any note submitted by user
    note: {
        type: String,
        label: 'Note',
        optional: true,
        max: 5000
    },
    vaultId: {
        type: String,
        label: 'Vault',
    },
    ownerId: {
        type: String,
        label: 'Owner',
        index: 1,
        min: 1
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: new Date()
                };
            } else {
                this.unset();
            }
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    },
    deletedAt: {
        type: Date,
        optional: true
    }
});


/*
-----------------------
  ATTACH
-----------------------
*/
Vaults.attachSchema(Schemas.Vault);
Sites.attachSchema(Schemas.Site);