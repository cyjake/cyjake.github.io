var duoshuoQuery = { short_name:"dotnil" };


KISSY.config('packages', {
    mosaics: {
        base: 'http://g.tbcdn.cn/thx/m',
        combine: true,
        debug: false,
        tag: '20130905'
    }
})

KISSY.ready(function(S) {
    S.getScript('http://static.duoshuo.com/embed.js')

    S.use('gallery/menu-aim/1.1/index', function(S, Menu) {

        var $ = S.all
        var wrapEl = $('#J_MenuWrap')
        var menuEl = $('#J_Menu')
        var contEl = $('#J_Cont')
        var entriesEl = contEl.all('.entries')

        menuEl.all('.category').each(function(cat, i) {
            S.Node(cat).data('index', i)
        })

        menuEl.delegate('click', '.category', function(e) {
            e.preventDefault()
        })

        wrapEl.on('mouseleave', function() {
            contEl.hide()
            menuEl.all('.category').removeClass('current')
        })

        var enterHandler = function(row) {
            var rowEl = $(row)
            var index = parseInt(rowEl.data('index'), 10)

            contEl.show()

            rowEl.addClass('current')
                 .siblings().removeClass('current')

            entriesEl.item(index).show()
                     .siblings().hide()
        }

        var leaveHandler = function() {}

        new Menu({
            wrap: '#aside',
            menu: '#J_Menu',
            rows: '.category',
            handler: {
                enterHandler: enterHandler,
                leaveHandler: leaveHandler
            }
        })
    })

    S.use('brix/app', function(S, app) {
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
})