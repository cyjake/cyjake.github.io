;(function() {

  'use strict'

  window.posts.some(function(post) {
    post.slug = post.path.replace(/^\w+\/\w+\/\d+-\d+-\d+-/, '').replace(/\.\w+$/, '')
    var pathWas = [].concat(post.categories, post.slug).join('/')
    var path = [].concat(
      post.categories,
      post.date,
      post.slug
    ).join('/')

    if (location.href.indexOf(pathWas) > 0) {
      checkPath(path)
      return true
    }
  })

  function checkPath(path) {
    var xhr = new XMLHttpRequest()

    xhr.onload = function() {
      if (this.status === 200) redirectTo(path)
    }
    xhr.open('get', '/' + path)
    xhr.send()
  }

  function redirectTo(path) {
    location.replace(location.href.split('/').slice(0, 3).concat(path).join('/'))
  }
})()
