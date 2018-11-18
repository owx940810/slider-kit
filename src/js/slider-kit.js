/* eslint no-new: "off", no-unused-vars: "off" */

const kit = {
  sliders: []
}

class Sliderkit {
  constructor () {
    // to cater for scrollbar width
    setTimeout(() => {
      this.getElements()
      this.init()
    }, 200)
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

      let buttonleft = wrapper.querySelector('button.slider-button-left')
      let buttonright = wrapper.querySelector('button.slider-button-right')

      let buttons = {}
      if (buttonleft && buttonright) {
        buttons = {
          left: buttonleft,
          right: buttonright
        }
      }

      let paginations = wrapper.querySelector('.slider-paginations')
      if (paginations) {
        ;[...(items)].map((item, index) => {
          let ele = document.createElement('div')
          ele.classList.add('slider-page')

          if (index === 0) {
            ele.classList.add('active')
          }

          paginations.appendChild(ele)
        })
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
        startY: 0,
        button: buttons,
        paginations: paginations
      }
    })

    if (kit.sliders.length <= 0) {
      throw new Error('no slider-kit found')
    }
  }

  setEventListeners (slider) {
    if (navigator.userAgent.toLocaleLowerCase().indexOf('mobile') >= 0) {
      slider.ele.addEventListener('touchstart', event => this.start(event, slider), { passive: false })
      window.addEventListener('touchmove', event => this.move(event, slider), { passive: false })
      window.addEventListener('touchend', event => this.end(event, slider), { passive: false })
    } else {
      slider.ele.addEventListener('mousedown', event => this.start(event, slider))
      window.addEventListener('mousemove', event => this.move(event, slider))
      window.addEventListener('mouseup', event => this.end(event, slider))
    }

    [...(slider.items)].map(item => {
      item.addEventListener('click', e => {
        if (slider.itemsWrapper.style.cssText.indexOf('transition') >= 0) {
          e.preventDefault()
        }
      })
    })
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

      this.setEventListeners(slider)

      if (slider.button.left) {
        slider.button.left.addEventListener('click', () => {
          slider.index--
          this.bounce(slider, slider.index)
        })
      }
      if (slider.button.right) {
        slider.button.right.addEventListener('click', () => {
          slider.index++
          this.bounce(slider, slider.index)
        })
      }

      if (slider.paginations) {
        ;[...(slider.paginations.children)].map((page, index) => {
          page.addEventListener('click', () => {
            this.bounce(slider, index)
            this.setPagination(slider, index)
          })
        })
      }
    })
  }

  start (event, slider) {
    if (event.target.tagName === 'button' || event.target.classList.contains('slider-page')) {
      event.preventDefault()
      return
    }
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

  end (event, slider) {
    if (!slider.state.touch) {
      return
    }

    if (slider.state.movement) {
      event.preventDefault()
    }

    if (Math.floor(slider.position) === Math.floor(slider.end)) {
      slider.state.touch = false
      return
    }

    slider.state.touch = false
    this.bounce(slider)
  }

  setPagination (slider, index) {
    if (!slider.paginations) {
      return
    }
    slider.paginations.querySelector('.active').classList.remove('active')
    slider.paginations.children[index].classList.add('active')
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
    this.setPagination(slider, slider.index)
  }
}
