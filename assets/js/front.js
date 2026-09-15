;(function() {

  'use strict'

  var gallery = [
    {
      title: '',
      src: '/assets/gallery/village-1280.webp',
      srcset: '/assets/gallery/village-1280.webp 1280w, /assets/gallery/village-2560.webp 2560w',
      tone: '#333640',
      theme: 'light'
    },
    {
      title: 'July 2025',
      src: '/assets/gallery/2025-07-20-r0001998-1280.webp',
      srcset: '/assets/gallery/2025-07-20-r0001998-1280.webp 1280w, /assets/gallery/2025-07-20-r0001998-2560.webp 2560w',
      tone: '#94b8d4',
      theme: 'dark'
    },
    {
      title: 'July 2020',
      src: '/assets/gallery/2020-07-13-dsc00639-1280.webp',
      srcset: '/assets/gallery/2020-07-13-dsc00639-1280.webp 1280w, /assets/gallery/2020-07-13-dsc00639-2560.webp 2560w',
      tone: '#7c98ba',
      theme: 'dark'
    },
    {
      title: 'October 2025',
      src: '/assets/gallery/2025-10-03-r0002395-1280.webp',
      srcset: '/assets/gallery/2025-10-03-r0002395-1280.webp 1280w, /assets/gallery/2025-10-03-r0002395-2560.webp 2560w',
      tone: '#c0c8d0',
      theme: 'dark'
    }
  ]

  var GALLERY_INTERVAL = 10000
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var image = document.querySelector('figure img')
  var caption = document.querySelector('figure figcaption')
  var loader = new Image()
  var galleryIndex = Math.floor(Math.random() * gallery.length)

  function load(index) {
    var data = gallery[index]

    document.body.style.setProperty('--gallery-tone', data.tone)
    document.body.dataset.theme = data.theme
    image.style.opacity = 0

    loader.onload = function onload() {
      image.src = data.src
      image.srcset = data.srcset
      image.sizes = '100vw'
      caption.textContent = data.title

      window.requestAnimationFrame(function() {
        image.style.opacity = 1
      })

      if (!reduceMotion && gallery.length > 1) {
        window.setTimeout(next, GALLERY_INTERVAL)
      }
    }

    loader.sizes = '100vw'
    loader.srcset = data.srcset
    loader.src = data.src
  }

  function next() {
    galleryIndex = (galleryIndex + 1) % gallery.length
    load(galleryIndex)
  }

  load(galleryIndex)

})()
