;(function(undefined) {

  window.posts.some(function(post) {
    var pathWas = [].concat(post.categories, post.slug).join('/')
    var path = [].concat(
      post.categories,
      post.date,
      post.slug
    ).join('/')

    if (location.href.indexOf(pathWas) > 0) {
      location.replace(location.href.split('/').slice(0, 3).concat(path).join('/'))
      return true
    }
  })

  var doc = document
  var referer = doc.referer || location.href
  var dispatcher = doc.getElementById('dispatcher')
  var candidates = dispatcher.getElementsByTagName('a')

  if (referer && /cyj.me/.test(referer)) {
    var path = referer.replace(/http:\/\/([^.]+\.)?cyj.me\//, '')

    if (path) {
      for (var i = 0, len = candidates.length; i < len; i++) {
        var a = candidates[i]

        a.href += path
        a.innerHTML += '/' + path
      }
    }
  }
  else {
    dispatcher.style.display = 'none'
  }
})()
