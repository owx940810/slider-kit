"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint no-new: "off", no-unused-vars: "off" */
var kit = {
  sliders: []
};

var Sliderkit =
/*#__PURE__*/
function () {
  function Sliderkit(element) {
    _classCallCheck(this, Sliderkit);

    if (!arguments.length) {
      this.getElements();
    } else {
      kit.sliders.push(this.getSlider(element));
    }

    this.init();
  }

  _createClass(Sliderkit, [{
    key: "getSlider",
    value: function getSlider(element) {
      var wrapper = element.querySelector('.slider-wrapper');

      if (!wrapper) {
        throw new Error("couldn't find slider-wrapper in slider-kit no.".concat(index));
      }

      var itemsWrapper = wrapper.querySelector('.slider-items');

      if (!itemsWrapper) {
        throw new Error("couldn't find slider-items in slider-kit no.".concat(index));
      }

      var items = wrapper.querySelectorAll('.slider-item');

      if (items.length < 0) {
        throw new Error("couldn't find slider-item in slider-kit no.".concat(index));
      }

      var buttonleft = wrapper.querySelector('button.slider-button-left');
      var buttonright = wrapper.querySelector('button.slider-button-right');
      var buttons = {};

      if (buttonleft && buttonright) {
        buttons = {
          left: buttonleft,
          right: buttonright
        };
      }

      var paginations = wrapper.querySelector('.slider-paginations');

      if (paginations) {
        ;

        _toConsumableArray(items).map(function (item, index) {
          var ele = document.createElement('div');
          ele.classList.add('slider-page');

          if (index === 0) {
            ele.classList.add('active');
          }

          paginations.appendChild(ele);
        });
      }

      return {
        ele: element,
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
      };
    }
  }, {
    key: "getElements",
    value: function getElements() {
      var _this = this;

      kit.sliders = _toConsumableArray(document.querySelectorAll('.slider-kit')).map(function (slider, index) {
        return _this.getSlider(slider);
      });

      if (kit.sliders.length <= 0) {
        throw new Error('no slider-kit found');
      }
    }
  }, {
    key: "setEventListeners",
    value: function setEventListeners(slider) {
      var _this2 = this;

      if (navigator.userAgent.toLocaleLowerCase().indexOf('mobile') >= 0) {
        slider.ele.addEventListener('touchstart', function (event) {
          return _this2.start(event, slider);
        }, {
          passive: false
        });
        window.addEventListener('touchmove', function (event) {
          return _this2.move(event, slider);
        }, {
          passive: false
        });
        window.addEventListener('touchend', function (event) {
          return _this2.end(event, slider);
        }, {
          passive: false
        });
      } else {
        slider.ele.addEventListener('mousedown', function (event) {
          return _this2.start(event, slider);
        });
        window.addEventListener('mousemove', function (event) {
          return _this2.move(event, slider);
        });
        window.addEventListener('mouseup', function (event) {
          return _this2.end(event, slider);
        });
      }

      _toConsumableArray(slider.items).map(function (item) {
        item.addEventListener('click', function (e) {
          if (slider.itemsWrapper.style.cssText.indexOf('transition') >= 0) {
            e.preventDefault();
          }
        });
      });
    }
  }, {
    key: "init",
    value: function init() {
      var _this3 = this;

      kit.sliders.map(function (slider) {
        var marginleft = window.getComputedStyle(slider.items[0])['margin-left'];

        if (marginleft) {
          slider.width += parseInt(marginleft.substring(0, marginleft.length - 2));
        }

        var marginright = window.getComputedStyle(slider.items[0])['margin-right'];

        if (marginright) {
          slider.width += parseInt(marginright.substring(0, marginright.length - 2));
        }

        if (slider.max * slider.width > slider.wrapper.offsetWidth) {
          slider.maxposition = slider.max * slider.width - (slider.wrapper.offsetWidth - slider.width);
        }

        _this3.setEventListeners(slider);

        if (slider.button.left) {
          slider.button.left.addEventListener('click', function () {
            slider.index--;

            _this3.bounce(slider, slider.index);
          });
        }

        if (slider.button.right) {
          slider.button.right.addEventListener('click', function () {
            slider.index++;

            _this3.bounce(slider, slider.index);
          });
        }

        if (slider.paginations) {
          ;

          _toConsumableArray(slider.paginations.children).map(function (page, index) {
            page.addEventListener('click', function () {
              _this3.bounce(slider, index);

              _this3.setPagination(slider, index);
            });
          });
        }
      });
    }
  }, {
    key: "start",
    value: function start(event, slider) {
      if (event.target.tagName === 'button' || event.target.classList.contains('slider-page')) {
        event.preventDefault();
        return;
      }

      slider.state.touch = true;
      slider.itemsWrapper.style.transition = '';
      slider.state.movement = false;
      slider.startX = event.clientX || event.touches[0].clientX;

      if (event.type === 'touchstart') {
        slider.startY = event.touches[0].clientY;
      }
    }
  }, {
    key: "move",
    value: function move(event, slider) {
      if (!slider.state.touch) {
        return;
      }

      var clientX;

      if (event.type === 'mousemove') {
        clientX = event.clientX;
      } else {
        clientX = event.touches[0].clientX;
      }

      if (!slider.state.movement) {
        var clientY = 0;

        if (event.type === 'touchmove') {
          clientY = event.touches[0].clientY;
        }

        if (clientY && Math.abs(clientY - slider.startY) > Math.abs(clientX - slider.startX)) {
          slider.state.movement = false;
          slider.state.touch = false;
          return;
        }
      }

      event.preventDefault();
      slider.state.movement = true;
      slider.position = slider.end - slider.startX + clientX;
      slider.itemsWrapper.style.transform = "translateX(".concat(slider.position, "px)");
    }
  }, {
    key: "end",
    value: function end(event, slider) {
      if (!slider.state.touch) {
        return;
      }

      if (slider.state.movement) {
        event.preventDefault();
      }

      if (Math.floor(slider.position) === Math.floor(slider.end)) {
        slider.state.touch = false;
        return;
      }

      slider.state.touch = false;
      this.bounce(slider);
    }
  }, {
    key: "setPagination",
    value: function setPagination(slider, index) {
      if (!slider.paginations) {
        return;
      }

      slider.paginations.querySelector('.active').classList.remove('active');
      slider.paginations.children[index].classList.add('active');
    }
  }, {
    key: "bounce",
    value: function bounce(slider, index) {
      if (index === undefined) {
        slider.index = -Math.round(slider.position / slider.width);
      } else {
        slider.index = index;
      }

      slider.itemsWrapper.style.transition = 'transform 250ms ease-in-out';

      if (slider.index < 0) {
        slider.index = 0;
      }

      if (slider.index >= slider.max) {
        slider.index = slider.max;
      }

      var tempposition = -slider.index * slider.width;

      if (tempposition < -slider.maxposition) {
        tempposition = -slider.maxposition;
      }

      slider.end = slider.position = tempposition;
      slider.wrapper.dataset.sliderindex = slider.index;
      slider.itemsWrapper.style.transform = "translateX(".concat(slider.position, "px)");
      this.setPagination(slider, slider.index);
    }
  }]);

  return Sliderkit;
}();