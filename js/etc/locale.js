(function() {
    'use strict';

    allowDebugLogging = true;

    Cryptodog.locale = {};
    Cryptodog.langlist = {};

    Cryptodog.locale.set = function (locale, refresh) {
        log("locale set to '" + locale + "', refresh=" + stringifyBool(refresh));

        // make locale lowercase
        locale = locale.toLowerCase();
        
        // handle aliases
        if (Cryptodog.langlist.aliases.hasOwnProperty(locale)) {
            var newlang = Cryptodog.langlist.aliases[locale];
            log(locale + " -> " + newlang);
            locale = newlang;
        }

        // make sure language is present
        if (Cryptodog.langlist.languages.indexOf(locale) === -1) {
            // language not present, default to en-US
            console.warn("Locale '" + locale + "' was not found, defaulting to en-US.");
            locale = "en-us";
        } else {
            log("Locale '" + locale + "' found, loading.");
        }
            
        // load language file
        // TODO: Handle missing language elements (load missing from en-us?)
        $.getJSON("lang/" + locale + ".json", function(data) {
            log("Got language file '" + locale + "'");
            for (var o in data) {
                if (data.hasOwnProperty(o)) {
                    Cryptodog.locale[o] = data[o];
                }
            }
            if (refresh)
                Cryptodog.locale.refresh(data);
        });
    };

    // Re-render login page with new strings
    Cryptodog.locale.refresh = function(languageObject) {
        if (languageObject.smallType) {
            $('body').css({ 'font-size': '13px' });
        } else {
            $('body').css({ 'font-size': '11px' });
        }
        $('body').css('font-family', languageObject.fonts);
        $('#introHeader').text(languageObject.loginWindow.introHeader);
        $('#introParagraph').html(languageObject.loginWindow.introParagraph);
        $('#customServer').text(languageObject.loginWindow.customServer);
        $('#conversationName').attr('placeholder', languageObject.loginWindow.conversationName);
        $('#conversationName').attr('data-utip', languageObject.loginWindow.conversationNameTooltip);
        $('#nickname').attr('placeholder', languageObject.loginWindow.nickname);
        $('#loginSubmit').val(languageObject.loginWindow.connect);
        $('#loginInfo').text(languageObject.loginWindow.enterConversation);
        $('#logout').attr('data-utip', languageObject.chatWindow.logout);
        $('#audio').attr('data-utip', languageObject.chatWindow.audioNotificationsOff);
        $('#notifications').attr('data-utip', languageObject.chatWindow.desktopNotificationsOff);
        $('#myInfo').attr('data-utip', languageObject.chatWindow.myInfo);
        $('#status').attr('data-utip', languageObject.chatWindow.statusAvailable);
        $('#buddy-groupChat').find('span').text(languageObject.chatWindow.conversation);
        $('#languageSelect').text($('[data-locale=' + languageObject.language + ']').text());
        $('[data-login=cryptocat]').text(languageObject.login.groupChat);
        $('[data-utip]').utip();
        $('html').attr('dir', languageObject.direction);
        if (languageObject.direction === 'ltr') {
            $('div#bubble #info li').css('background-position', 'top left');
        } else {
            $('div#bubble #info li').css('background-position', 'top right');
        }
        $('#conversationName').select();
    };

    // Populate language
    if (typeof (window) !== 'undefined') {
        $(window).ready(function() {
            log("Window ready, loading language based on browser preferences");
            var lang = window.navigator.userLanguage || window.navigator.language;
            // fetch langlist
            $.getJSON("lang/langlist.json", function (data) {
                log("Got langlist file");
                Cryptodog.langlist = data;
                Cryptodog.locale.set(lang, true);
            })
        });
    }

})();
