;(function() {

  'use strict'

  function tryRedirectTo(path) {
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
    var slug = post.path.replace(/^\w+\/\w+\/\d+-\d+-\d+-/, '').replace(/\.\w+$/, '')

    if (location.href.indexOf([post.categories, slug].join('/')) > 0 ||
        location.href.indexOf([post.date, slug].join('/')) > 0) {
      tryRedirectTo([post.categories, post.date, slug].join('/'))
      return true
    }
  }

  if (/^\/jorma/.test(location.pathname)) {
    redirectTo('leoric')
  }
  else if (/-jorma(-ii?\/?)$/.test(location.pathname)) {
    redirectTo(location.pathname.slice(1).replace(/-jorma(-ii?\/?)$/, '-leoric$1'))
  }
  else if (checkPosts(window.posts)) {
    // nothing to do
  }
  else {
    document.body.classList.remove('hidden')
  }

})()
