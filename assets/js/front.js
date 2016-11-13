;(function() {

  function elastic() {
    var bg = document.querySelector('.bg')
    var img = document.querySelector('.bg img')

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
      offsetLeft = (img.offsetHeight * actualRatio - img.offsetWidth) / 2  - 100
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

  function main() {
    var img = document.querySelector('.bg img')


    function onload() {
      elastic()
      window.onresize = throttle(elastic, 100)
      setTimeout(function() {
        img.style.opacity = 1
      }, 1)
    }

    img.onload = onload
    img.src = img.dataset.src
  }

  main()

})()
