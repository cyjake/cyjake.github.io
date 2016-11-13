;(function() {

  'use strict'

  /**
   * breed generations of descendants to complete the tree
   */
  function breed(parentNode, generations) {
    while (generations-- > 0) {
      var intermediateNode = {
        level: parentNode.level,
        parentNode: parentNode,
        text: 'Untitled',
        nodes: []
      }
      parentNode.nodes.push(intermediateNode)
      parentNode = intermediateNode
    }

    return parentNode
  }

  /**
   * parse headings into a tree
   */
  function parseHeadings(el) {
    var headings = el.querySelectorAll('h1, h2, h3, h4')
    var root = { nodes: [] }
    var prevNode = root
    var prevLevel = 0

    for (var i = 0, len = headings.length; i < len; i++) {
      var heading = headings[i]
      var level = parseInt(heading.tagName.toLowerCase().slice(1), 10)

      if (!heading.id) {
        heading.id = 'section-' + i.toString(36)
      }

      var node = {
        level: level,
        id: heading.id,
        text: heading.innerText,
        offsetTop: heading.offsetTop,
        nodes: []
      }

      if (level - prevLevel > 1) {
        prevNode = breed(prevNode, level - prevLevel - 1)
        prevLevel = prevNode.level
      }
      else if (prevLevel - level >= 0) {
        while (prevLevel - level >= 0) {
          prevNode = prevNode.parentNode
          prevLevel = prevNode.level
        }
      }

      node.parentNode = prevNode
      prevNode.nodes.push(node)
      prevNode = node
      prevLevel = level
    }

    return root
  }

  /**
   * format nodes into ordered list element
   */
  function renderNodes(nodes) {
    var ol = document.createElement('ol')

    for (var i = 0, len = nodes.length; i < len; i++) {
      var node = nodes[i]
      var li = document.createElement('li')
      var a = document.createElement('a')

      a.href = '#' + node.id
      a.text = node.text

      li.appendChild(a)
      li.classList.add('heading', 'heading' + node.level)
      if (node.level === 2) li.classList.add('folded')

      ol.appendChild(li)

      if (node.nodes && node.nodes.length) {
        li.appendChild(renderNodes(node.nodes))
      }
    }

    return ol
  }

  function onClickToC(e) {
    if (e.target.closest('#toc label')) {
      toggleToC(e)
    }
    else if (e.target.closest('#toc a[href]') && document.body.offsetWidth < 1200) {
      var entry = e.target.closest('#toc a[href]')
      var headingId = entry.href.split('#').pop()
      document.querySelector('#toc').classList.add('folded')
      setTimeout(function() {
        var heading = document.getElementById(headingId)
        var marginTop = window.getComputedStyle
          ? getComputedStyle(heading).marginTop
          : heading.currentStyle.marginTop
        var delta = heading.offsetHeight + parseInt(marginTop, 10)
        // adjust scrollTop to reveal the target heading
        document.querySelector('#page').scrollTop -= delta
      }, 1)
    }
  }

  function toggleToC(e) {
    var el = document.querySelector('#toc')

    if (el.classList.contains('folded')) {
      el.classList.remove('folded')
    } else {
      el.classList.add('folded')
    }
  }

  function toggleToCEntry(el) {
    Array.from(el.querySelectorAll('.active'), function(el) {
      el.classList.remove('active')
    })

    Array.from(el.querySelectorAll('.heading')).reverse().some(function(el) {
      var headingId = el.querySelector('a').href.split('#').pop()
      var heading = document.getElementById(headingId)
      var scrollTop = window.scrollY + parseInt(getComputedStyle(heading).marginTop, 10)

      if (scrollTop > heading.offsetTop) {
        el.classList.add('active')
        return true
      }
    })

    Array.from(el.querySelectorAll('.heading2'), function(el) {
      el.classList.add('folded')
    })

    try {
      el.querySelector('.active')
        .closest('.heading2').classList.remove('folded')
    } catch (err) {
      // ignored on purpose
    }
  }

  /**
   * initiate the table of contents
   */
  function renderToC(root) {
    var el = document.querySelector('#toc')

    if (el && root && root.nodes[0] && root.nodes[0].nodes.length) {
      el.appendChild(renderNodes(root.nodes[0].nodes))
    } else {
      el.classList.add('hidden')
    }
  }

  function sticky(el) {
    var topWas = parseInt(el.dataset.offsetTop, 10)

    if (!topWas) {
      el.dataset.offsetTop = el.offsetTop
      topWas = el.offsetTop
    }

    if (window.scrollY >= topWas - 30) {
      el.classList.add('sticky')
    } else {
      el.classList.remove('sticky')
    }
  }

  function onScroll() {
    sticky(document.querySelector('#toc'))
    sticky(document.querySelector('nav'))
    toggleToCEntry(document.querySelector('#toc'))
  }

  function debounce(fn, wait) {
    var timer

    return function(e) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(function() {
        fn(e)
        timer = null
      }, wait)
    }
  }

  function toggleNav() {
    if (document.body.classList.contains('nav-active')) {
      document.body.classList.remove('nav-active')
    } else {
      document.body.classList.add('nav-active')
    }
  }

  function main() {
    var articleEl = document.querySelector('#content article')

    if (articleEl) {
      renderToC(parseHeadings(articleEl))
      document.querySelector('#toc').addEventListener('click', onClickToC, false)
    }

    if (document.body.offsetWidth >= 1200) {
      document.querySelector('#toc').classList.remove('folded')
      window.addEventListener('scroll', debounce(onScroll, 50), false)
    } else {
      document.querySelector('nav > label')
        .addEventListener('click', toggleNav, false)
    }
  }

  main()

})()
