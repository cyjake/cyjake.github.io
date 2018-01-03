;(function() {

  'use strict'

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

  function checkPosts(posts) {
    for (var i = 0; i < posts.length; i++) {
      if (checkPost(posts[i])) {
        return true
      }
    }
    return false
  }

  function checkPost(post) {
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
  }

  if (/^\/leoric/.test(location.pathname)) {
    redirectTo('jorma')
  }
  else if (checkPosts(window.posts)) {
    // nothing to do
  }
  else {
    document.body.classList.remove('hidden')
  }

})()
