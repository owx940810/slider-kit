/* eslint no-new: "off", no-unused-vars: "off" */

let kit
let wrapper
let items

const slider = {
  state: {
    touch: false,
    movement: false
  },
  startX: 0,
  startY: 0,
  position: 0,
  end: 0,
  index: 0,
  max: 0,
  width: 0,
  maxposition: 0
}

class Sliderkit {
  constructor () {
    this.getElements()
    this.init()
  }

  getElements () {
    kit = window['slider-kit']

    if (!kit) {
      new Error('slider-kit not found')
    }

    wrapper = kit.querySelector('.slider-wrapper')

    if (!wrapper) {
      new Error('slider-wrapper not found')
    }

    items = wrapper.querySelectorAll('.slider-item')

    if (items.length < 0) {
      new Error('no slider-items found')
    }
  }

  init () {
    slider.width = items[0].offsetWidth
    slider.max = items.length - 1

    let marginleft = window.getComputedStyle(items[0])['margin-left']
    if (marginleft) {
      slider.width += parseInt(marginleft.substring(0, marginleft.length - 2))
    }

    let marginright = window.getComputedStyle(items[0])['margin-right']
    if (marginright) {
      slider.width += parseInt(marginright.substring(0, marginright.length - 2))
    }

    if (slider.max * slider.width > wrapper.offsetWidth) {
      slider.maxposition = (slider.max * slider.width) - (wrapper.offsetWidth - slider.width)
    }

    if (navigator.userAgent.toLocaleLowerCase().indexOf('mobile') >= 0) {
      kit.addEventListener('touchstart', event => this.start(event), { passive: false })
      window.addEventListener('touchmove', event => this.move(event), { passive: false })
      window.addEventListener('touchend', event => this.end(event), { passive: false })
    } else {
      kit.addEventListener('mousedown', event => this.start(event))
      window.addEventListener('mousemove', event => this.move(event))
      window.addEventListener('mouseup', event => this.end(event))
    }
  }

  start (event) {
    slider.state.touch = true
    wrapper.style.transition = ''
    slider.state.movement = false

    slider.startX = event.clientX || event.touches[0].clientX
    if (event.type === 'touchstart') {
      slider.startY = event.touches[0].clientY
    }
  }

  move (event) {
    if (!slider.state.touch) {
      return
    }

    let clientX = event.clientX || event.touches[0].clientX

    if (!slider.state.movement) {
      let clientY = 0
      if (event.type === 'touchmove') {
        clientY = event.touches[0].clientY
      }

      if (clientY && (Math.abs(clientY - slider.startY) > Math.abs(clientX - slider.startX))) {
        slider.state.movement = false
        slider.state.touch = false
        return
      }
    }
    event.preventDefault()
    slider.state.movement = true
    slider.position = slider.end - slider.startX + clientX
    wrapper.style.transform = `translateX(${slider.position}px)`
  }

  end () {
    if (!slider.state.touch) {
      return
    }

    if (Math.floor(slider.position) === Math.floor(slider.end)) {
      slider.state.touch = false
      return
    }

    slider.state.touch = false
    this.bounce()
  }

  bounce (index) {
    if (index === undefined) {
      slider.index = -(Math.round(slider.position / slider.width))
    } else {
      slider.index = index
    }

    wrapper.style.transition = 'transform 250ms ease-in-out'

    if (slider.index < 0) {
      slider.index = 0
    }

    if (slider.index >= slider.max) {
      slider.index = slider.max
    }
    let tempposition = -(slider.index) * slider.width
    if (tempposition < -(slider.maxposition)) {
      tempposition = -(slider.maxposition)
    }

    slider.end = slider.position = tempposition
    wrapper.dataset.sliderindex = slider.index
    wrapper.style.transform = `translateX(${slider.position}px)`
  }
}
