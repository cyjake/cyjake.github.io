;(function() {
  'use strict'

  var desktop = window.matchMedia('(min-width: 1200px) and (hover: hover)')
  var header = document.querySelector('.site-header')
  var navToggle = document.querySelector('.nav-toggle')
  var toc = document.querySelector('#toc')
  var articleBody = document.querySelector('.article-body')

  function closeNav() {
    if (!header || !navToggle) return
    header.classList.remove('nav-open')
    navToggle.setAttribute('aria-expanded', 'false')
  }

  if (header && navToggle) {
    navToggle.addEventListener('click', function() {
      var isOpen = header.classList.toggle('nav-open')
      navToggle.setAttribute('aria-expanded', isOpen.toString())
    })

    header.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeNav)
    })

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && header.classList.contains('nav-open')) {
        closeNav()
        navToggle.focus()
      }
    })

    document.addEventListener('click', function(event) {
      if (header.classList.contains('nav-open') && !header.contains(event.target)) {
        closeNav()
      }
    })
  }

  function setToCState() {
    if (!toc) return
    var toggle = toc.querySelector('.toc-toggle')
    if (desktop.matches) {
      toc.classList.remove('folded')
      toggle.setAttribute('aria-expanded', 'true')
    } else {
      toc.classList.add('folded')
      toggle.setAttribute('aria-expanded', 'false')
    }
  }

  function renderToC() {
    if (!toc || !articleBody) return

    var archive = articleBody.querySelector('.archive-list')
    var headings = Array.from(archive
      ? archive.querySelectorAll('.archive-year > h2')
      : articleBody.querySelectorAll('h2, h3, h4'))
    if (headings.length < 2) return

    var list = document.createElement('ol')
    headings.forEach(function(heading, index) {
      if (!heading.id) heading.id = 'section-' + index.toString(36)

      var item = document.createElement('li')
      var link = document.createElement('a')
      link.href = '#' + heading.id
      link.textContent = heading.textContent
      item.className = 'heading heading' + heading.tagName.slice(1)
      item.appendChild(link)
      list.appendChild(item)
    })

    toc.appendChild(list)
    function allowOutline() {
      toc.classList.remove('outline-dismissed')
    }
    toc.addEventListener('pointerenter', allowOutline)
    toc.addEventListener('focusin', allowOutline)
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && desktop.matches && toc.matches(':hover, :focus-within')) {
        toc.classList.add('outline-dismissed')
      }
    })
    toc.hidden = false
    toc.querySelector('.toc-toggle').addEventListener('click', function() {
      var isFolded = toc.classList.toggle('folded')
      this.setAttribute('aria-expanded', (!isFolded).toString())
    })

    toc.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        if (!desktop.matches) {
          toc.classList.add('folded')
          toc.querySelector('.toc-toggle').setAttribute('aria-expanded', 'false')
        }
      })
    })

    var scheduled = false
    function updateActiveHeading() {
      var activeLink = null
      headings.forEach(function(heading) {
        if (heading.getBoundingClientRect().top <= 160) {
          activeLink = toc.querySelector('a[href="#' + CSS.escape(heading.id) + '"]')
        }
      })

      toc.querySelectorAll('a').forEach(function(link) {
        var isActive = link === activeLink
        link.classList.toggle('active', isActive)
        if (isActive) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
      scheduled = false
    }

    window.addEventListener('scroll', function() {
      if (!scheduled) {
        scheduled = true
        window.requestAnimationFrame(updateActiveHeading)
      }
    }, { passive: true })

    setToCState()
    updateActiveHeading()
  }

  if (desktop.addEventListener) desktop.addEventListener('change', setToCState)
  renderToC()
})()
