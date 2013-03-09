$('#aside')
    .menuAim({
        rowSelector: '.category',
        submenuSelector: '.entries',
        activate: function(row) {
            $(row).addClass('category-active')
        },
        deactivate: function(row) {
            $(row).removeClass('category-active')
        }
    })
    .on('mouseleave', function(e) {
        $(e.currentTarget).find('.category-active').removeClass('category-active')
    });
