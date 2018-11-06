;(function() {

  'use strict'

  var gallery = [
    { title: '',
      asset: '/assets/gallery/village.jpg',
      url: 'https://img.alicdn.com/tfscom/TB1xDG5lQvoK1RjSZFDXXXY3pXa.jpg' }
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
      caption.innerHTML = data.title || 'Untitled'
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
      if (gallery.length > 1) setTimeout(next, GALLERY_INTERVAL)
    })
  }

  function main() {
    next()
    window.addEventListener('resize', throttle(elastic, 100))
  }

  main()

})()
