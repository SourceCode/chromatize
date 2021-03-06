/*
 * Creates the chromatize store in the window scope
 * @type object
 */
window.chromatizeStore = {};
window.chromatizeStore.enabled = false;

chrome.devtools.panels.create("Chromatize", "icon.png", "devpanel.html", function(panel) {
    var runOnce = false;
    panel.onShown.addListener(function(panelWindow) {
        if (runOnce) return;
        runOnce = true;
        window.chromatize = function(content)
        {
            $ = panelWindow.$; //set $ to jQuery
            $("#chromatize-message").append("<p>" + content + "</p>");
        }
    });
});

/**
 * Adds a listener for network requests finished
 */
chrome.devtools.network.onRequestFinished.addListener(function(req) {
    console.log(req);
    var reqURL = req.request.url;

    if (window.chromatizeStore.enabled === false)
    {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", chrome.runtime.getURL("responseType.json"));
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                var responseTypes = JSON.parse(xhr.responseText);
                window.chromatizeStore.responseTypes = responseTypes.responseTypeMap;
                xhr.open("GET", chrome.runtime.getURL("chromatize.json"));
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        var config = JSON.parse(xhr.responseText);
                        window.chromatizeStore.config = config;
                        console.log(window.chromatizeStore);
                    }
                };
                xhr.send();
            }
        };
        xhr.send();


        window.chromatizeStore.enabled = true;
    }


    var reqPackage = {

    };


    var chromatize = {
        procRequest: function()
        {

        },

        log: function(value)
        {
            try {
                window.chromatize(value);
            }
            catch(err) {
                console.log(err);
            }
        }
    };


    chromatize.log(reqURL);


});