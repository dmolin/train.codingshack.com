(function($){

$(document).ready(function() {
    if(!document.location.host.match('^localhost')) {
        getOutboundLinks().forEach(attachLinkEvent);
    }
});

function translateLink(url) {
    var lut = {
        'http://goo.gl/WRKjmb' : 'https://www.youtube.com/watch?v=xRoIXuFMlOw&list=PLzj35zuY5eae7D3DZrbz4_6f1pHeYwCCS'
    };
    return (lut[url] ? lut[url] : url);
}

function getOutboundLinks() {
    var links = [];
    $('a[href^=http]').each(function(){
        try {
            var link = translateLink($(this).attr('href'));
            var url = new URL(link);

            if(url.host != document.location.host) {
                links.push({ el: $(this), url:link });
            }
        } catch(errorIgnored) {}
    });
    return links;
}

function attachLinkEvent(linkObject) {
    if(!linkObject.el || !$.isFunction(linkObject.el.on)) return;
    linkObject.el.data('url', linkObject.url);
    linkObject.el.click(trackOutboundElement);
}

function trackOutboundElement(evt) {
    trackOutboundLink($(evt.target).data('url'));
    return false;
}

/**
* Function that tracks a click on an outbound link in Google Analytics.
* This function takes a valid URL string as an argument, and uses that URL string
* as the event label.
*/
function trackOutboundLink(url) {
   ga('send', 'event', 'outbound', 'click', url, {'hitCallback':
     function () {
     document.location = url;
     }
   });
}

}($));

