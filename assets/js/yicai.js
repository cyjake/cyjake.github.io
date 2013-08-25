var duoshuoQuery = { short_name:"dotnil" };

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
                    affix: '0.1.0',
                    toc: '0.1.2'
                }
            },
            debug: false
        })

        var tocTemplate = '' +
            '<div bx-name="mosaics/affix" bx-config="{countHeight: false}">' +
              '<label><i class="iconfont">&#61477;</i> 目录</label>' +
              '<ol>' +
              '{{#each tree}}' +
                '<li class="outmost"><a href="#{{id}}" class="j-entry level1">{{text}}</a>' +
                  '<ol>' +
                  '{{#each children}}' +
                    '<li><a href="#{{id}}" class="j-entry level2">{{text}}</a>' +
                      '{{#if children.length !== 0}}' +
                      '<ol>' +
                      '{{#each children}}' +
                        '<li><a href="#{{id}}" class="j-entry level3">{{text}}</a>' +
                      '{{/each}}' +
                      '</ol>' +
                      '{{/if}}' +
                    '</li>' +
                  '{{/each}}' +
                  '</ol>' +
                '</li>' +
              '{{/each}}' +
              '</ol>' +
            '</div>';

        S.all('#J_tocTemplate').html(tocTemplate)

        app.boot()
    })
})