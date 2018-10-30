/* eslint no-new: "off", no-unused-vars: "off" */

const kit = {
  sliders: []
}

class Sliderkit {
  constructor () {
    this.getElements()
    this.init()
  }

  getElements () {
    kit.sliders = [...(document.querySelectorAll('.slider-kit'))].map((slider, index) => {
      let wrapper = slider.querySelector('.slider-wrapper')
      if (!wrapper) {
        throw new Error(`couldn't find slider-wrapper in slider-kit no.${index}`)
      }

      let itemsWrapper = wrapper.querySelector('.slider-items')
      if (!itemsWrapper) {
        throw new Error(`couldn't find slider-items in slider-kit no.${index}`)
      }

      let items = wrapper.querySelectorAll('.slider-item')
      if (items.length < 0) {
        throw new Error(`couldn't find slider-item in slider-kit no.${index}`)
      }

      return {
        ele: slider,
        wrapper: wrapper,
        itemsWrapper: itemsWrapper,
        items: items,
        width: items[0].offsetWidth,
        max: items.length - 1,
        position: 0,
        end: 0,
        index: 0,
        maxposition: 0,
        state: {
          touch: false,
          movement: false
        },
        startX: 0,
        startY: 0
      }
    })

    if (kit.sliders.length <= 0) {
      throw new Error('no slider-kit found')
    }
  }

  init () {
    kit.sliders.map(slider => {
      let marginleft = window.getComputedStyle(slider.items[0])['margin-left']
      if (marginleft) {
        slider.width += parseInt(marginleft.substring(0, marginleft.length - 2))
      }

      let marginright = window.getComputedStyle(slider.items[0])['margin-right']
      if (marginright) {
        slider.width += parseInt(marginright.substring(0, marginright.length - 2))
      }

      if (slider.max * slider.width > slider.wrapper.offsetWidth) {
        slider.maxposition = (slider.max * slider.width) - (slider.wrapper.offsetWidth - slider.width)
      }

      if (navigator.userAgent.toLocaleLowerCase().indexOf('mobile') >= 0) {
        slider.ele.addEventListener('touchstart', event => this.start(event, slider), { passive: false })
        window.addEventListener('touchmove', event => this.move(event, slider), { passive: false })
        window.addEventListener('touchend', event => this.end(slider), { passive: false })
      } else {
        slider.ele.addEventListener('mousedown', event => this.start(event, slider))
        window.addEventListener('mousemove', event => this.move(event, slider))
        window.addEventListener('mouseup', event => this.end(slider))
      }
    })
  }

  start (event, slider) {
    slider.state.touch = true
    slider.itemsWrapper.style.transition = ''
    slider.state.movement = false

    slider.startX = event.clientX || event.touches[0].clientX
    if (event.type === 'touchstart') {
      slider.startY = event.touches[0].clientY
    }
  }

  move (event, slider) {
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
    slider.itemsWrapper.style.transform = `translateX(${slider.position}px)`
  }

  end (slider) {
    if (!slider.state.touch) {
      return
    }

    if (Math.floor(slider.position) === Math.floor(slider.end)) {
      slider.state.touch = false
      return
    }

    slider.state.touch = false
    this.bounce(slider)
  }

  bounce (slider, index) {
    if (index === undefined) {
      slider.index = -(Math.round(slider.position / slider.width))
    } else {
      slider.index = index
    }

    slider.itemsWrapper.style.transition = 'transform 250ms ease-in-out'

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
    slider.wrapper.dataset.sliderindex = slider.index
    slider.itemsWrapper.style.transform = `translateX(${slider.position}px)`
  }
}
