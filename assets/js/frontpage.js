;(function() {

function elastic() {
  var bg = document.querySelector('.bg')
  var img = document.querySelector('.bg img')

  var ratio = bg.offsetWidth / bg.offsetHeight
  var offsetTop = 0
  var offsetLeft = 0

  if (ratio >= 3/2) {
    offsetTop = (img.offsetWidth / ratio - img.offsetHeight) / 2
    if (offsetTop < 0) {
      img.style.marginTop = offsetTop + 'px'
    }
  } else {
    offsetLeft = (img.offsetHeight * ratio - img.offsetWidth) / 2  - 100
    if (offsetLeft < 0) {
      img.style.marginLeft = offsetLeft + 'px'
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

elastic()
window.onresize = throttle(elastic, 100)

})()
