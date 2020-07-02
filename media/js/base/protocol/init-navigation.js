/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Initialize Protocol Navigation.
 */
(function() {
    'use strict';

    if (typeof Mzp === 'undefined' || typeof Mzp.Menu === 'undefined' || typeof Mzp.Navigation === 'undefined') {
        return;
    }

    var hasMediaQueries = typeof window.matchMedia !== 'undefined';

    function onImageLoad(e) {
        e.target.removeAttribute('data-src');
        e.target.removeAttribute('data-srcset');
    }

    function handleOnMenuOpen(el) {
        if (!hasMediaQueries || !window.matchMedia('(min-width: 768px)').matches) {
            return;
        }

        var cardImage = el.querySelector('.mzp-c-card-image');

        if (cardImage) {
            var newSrc = cardImage.getAttribute('data-src');

            if (newSrc) {
                var newSrcSet = cardImage.getAttribute('data-srcset');

                if (newSrcSet) {
                    cardImage.srcset = newSrcSet;
                }

                cardImage.src = newSrc;
                cardImage.onload = onImageLoad;
            }

        }
    }

    function initNavButton() {
        if (typeof Mozilla.Client === 'undefined') {
            return false;
        }

        var nav = document.querySelector('.mzp-c-navigation');
        var fxaButton = document.querySelector('.mzp-c-navigation .c-navigation-fxa-cta');

        // Nav should be present on page.
        if (!nav) {
            return false;
        }

        // Check that FxA button exists on the page, and visitor is using Firefox Desktop.
        if (fxaButton && Mozilla.Client.isFirefoxDesktop) {
            var fxaButtonAltHref = fxaButton.getAttribute('data-alt-href');

            // Update the button if user is signed in
            Mozilla.Client.getFxaDetails(function(details) {
                if (details.setup) {
                    nav.classList.add('fxa-signed-in');
                    fxaButton.href = fxaButtonAltHref;
                }
            });
        }

        // Add a CSS hook for animating the nav button (issue #9009)
        nav.classList.add('nav-button-is-ready');
    }

    initNavButton();

    Mzp.Menu.init({
        onMenuOpen: handleOnMenuOpen
    });

    Mzp.Navigation.init();
})();
