;(function() {

  'use strict'

  var gallery = [
    { title: '上平宫',
      asset: '/assets/gallery/shangping.jpg',
      url: 'https://ossgw.alicdn.com/creatives-assets/image/2016/11/13/51dd02e3-806b-4e6b-9670-564ed230544c.jpg' },
    { title: '灯火通明',
      asset: '/assets/gallery/alibaba.jpg',
      url: 'https://ossgw.alicdn.com/creatives-assets/image/2016/11/13/60038278-fa46-4b0a-b59e-0578bd8f8913.jpg' },
    { title: '划水',
      asset: '/assets/gallery/row.jpg',
      url: 'https://ossgw.alicdn.com/creatives-assets/image/2016/11/13/b7fc9777-faad-4c17-9344-d3c550187908.jpg' }
  ]

  /**
   * the interval of the gallery slide show.
   */
  var GALLERY_INTERVAL = 10000


  function elastic() {
    var bg = document.querySelector('figure')
    var img = document.querySelector('figure img')

    var actualRatio = bg.offsetWidth / bg.offsetHeight
    var expectedRatio = img.offsetWidth / img.offsetHeight
    var offsetTop = 0
    var offsetLeft = 0

    if (actualRatio >= expectedRatio) {
      img.style.maxWidth = '100%'
      img.style.maxHeight = 'none'
      offsetTop = (img.offsetWidth / actualRatio - img.offsetHeight) / 2
      if (offsetTop < 0) {
        img.style.marginTop = offsetTop + 'px'
        img.style.marginLeft = 0
      }
    } else {
      img.style.maxHeight = '100%'
      img.style.maxWidth = 'none'
      offsetLeft = (img.offsetHeight * actualRatio - img.offsetWidth) / 2
      if (offsetLeft < 0) {
        img.style.marginLeft = offsetLeft + 'px'
        img.style.marginTop = 0
      }
    }
  }

  function throttle(fn, wait) {
    var timer

    return function() {
      if (timer) return

      timer = setTimeout(function() {
        fn()
        timer = null
      }, wait)
    }
  }

  var loader = new Image()

  function load(index, fn) {
    var data = gallery[index]
    var img = document.querySelector('figure img')
    var caption =  document.querySelector('figure figcaption')

    loader.onload = function onload() {
      img.src = data.url
      caption.innerHTML = data.title
      elastic()
      fn()
      setTimeout(function() {
        img.style.opacity = 1
      }, 0)
    }
    loader.src = data.url
    img.style.opacity = 0
  }

  var galleryIndex = 0

  function next() {
    if (++galleryIndex >= gallery.length) galleryIndex = 0
    load(galleryIndex, function() {
      setTimeout(next, GALLERY_INTERVAL)
    })
  }

  function main() {
    next()
    window.addEventListener('resize', throttle(elastic, 100))
  }

  main()

})()
