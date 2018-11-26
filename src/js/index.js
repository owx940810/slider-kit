let interval = setInterval(() => {
  if ([...(document.body.querySelectorAll('img'))].map(img => img.complete).indexOf(false) < 0) {
    new Sliderkit()
    clearInterval(interval)
  }
}, 100)
