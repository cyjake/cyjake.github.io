var duoshuoQuery = { short_name: "dotnil" }


KISSY.config('packages', {
    mosaics: {
        base: 'http://g.tbcdn.cn/thx/m',
        combine: true,
        debug: false,
        tag: '20130905'
    }
})

KISSY.use('node,event', function(S) {
    if (S.one('#comments-board')) {
        S.getScript('http://static.duoshuo.com/embed.js')
    }

    S.one('#aside .label').on('click', function(e) {
        var page = S.one('#page')
        page.css('left', parseInt(page.css('left'), 10) > 0 ? 0 : S.one('#aside').outerWidth())
    })
})

KISSY.use('brix/app', function(S, app) {
    app.config({
        imports: {
            mosaics: {
                stoc: '0.0.1'
            }
        }
    })

    app.bootStyle(function() {
        app.boot()
    })
})