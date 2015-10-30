Template.generator.onRendered(function () {
    this.$('.ui.dropdown').dropdown();
    this.$('.ui.accordion').accordion();
});

Template.generator.events({
    'click .expert': function(e) {
        $('.simple-content').hide();
        $('.expert-content').show();
        $('#generator-length').val('20');
        $('#generator-regex').val('[\\d\\W\\w\\p]');
    },
    'click .simple': function(e) {
        $('.simple-content').show();
        $('.expert-content').hide();
        $('#generator-length').val('12');
        $('#generator-regex').val('[\\d\\w\\p]');
    },
    'click .generate': function(e) {
        var defaultLength = parseInt($('#generator-length').val(), 10),
            defaultRegex  = $('#generator-regex').val();

        // Checking length
        if (defaultLength <= 0 || isNaN(defaultLength)) {
            defaultLength = 20;
        }

        // Checking regex size, replacing regex if needed
        if (!defaultRegex) {
            defaultRegex = '[\d\W\w\p]';
        }

        var password = generatePassword(defaultLength, false,
                    new RegExp(defaultRegex));

        // Generating password
        while (password.length < 1) {
            password = generatePassword(defaultLength, false,
                    new RegExp(defaultRegex));
        }

        // Append
        UI.renderWithData(Template.generatorLine, {
            password: password,
            length: password.length
        }, $('.generated tbody').get(0));

        var root     = $('.generated tbody').children().last(),
            input    = root.find('.password input'),
            trash    = root.find('.trash.icon'),
            progress = root.find('.indicating.progress');

        input.complexify({}, function (valid, complexity) {
            progress.progress({
                percent: complexity
            });
        });

        // Bind click
        trash.on('click', function() {
            trash.off('click');
            root.remove();
        });
    }
});