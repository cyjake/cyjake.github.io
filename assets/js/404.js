(function(undefined) {

    var doc = document,
        referer = doc.referer || location.href,
        dispatcher = doc.getElementById('dispatcher'),
        cands = dispatcher.getElementsByTagName('a'),
        path, i, a, len;

    if (referer && /cyj.me/.test(referer)) {
        path = referer.replace(/http:\/\/([^.]+\.)?cyj.me\//, '');
        if (path) {
            for (i = 0, len = cands.length; i < len; i++) {
                a = cands[i];
                a.href += path;
                a.innerHTML += '/' + path;
            }
        }
    }
    else {
        dispatcher.style.display = 'none';
    }
})();