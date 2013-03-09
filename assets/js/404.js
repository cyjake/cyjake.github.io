;(function(undefined) {

    var doc = document
    var referer = doc.referer || location.href
    var dispatcher = doc.getElementById('dispatcher')
    var cands = dispatcher.getElementsByTagName('a')

    if (referer && /cyj.me/.test(referer)) {
        var path = referer.replace(/http:\/\/([^.]+\.)?cyj.me\//, '')

        if (path) {
            for (var i = 0, len = cands.length; i < len; i++) {
                var a = cands[i]

                a.href += path
                a.innerHTML += '/' + path
            }
        }
    }
    else {
        dispatcher.style.display = 'none'
    }
})()