var duoshuoQuery = { short_name:"dotnil" };

KISSY.ready(function(S) {
    S.getScript('http://static.duoshuo.com/embed.js')

    S.getScript('http://a.tbcdn.cn/s/kissy/gallery/menu-aim/1.1/index-min.js', function() {
    S.use('gallery/menu-aim/1.1/menu-aim', function(S, Menu) {


        var $ = S.all
        var wrapEl = $('#aside')
        var menuEl = $('#J_Menu')
        var contEl = $('#J_Cont')
        var entriesEl = contEl.all('.entries')

        menuEl.all('.category').each(function(cat, i) {
            S.Node(cat).data('index', i)
        })

        var enterHandler = function(row) {
            var rowEl = $(row)
            var index = parseInt(rowEl.data('index'))

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
    })
})