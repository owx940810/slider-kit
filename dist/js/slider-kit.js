"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint no-new: "off", no-unused-vars: "off" */
var kit;
var wrapper;
var items;
var slider = {
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
};

var Sliderkit =
/*#__PURE__*/
function () {
  function Sliderkit() {
    _classCallCheck(this, Sliderkit);

    this.getElements();
    this.init();
  }

  _createClass(Sliderkit, [{
    key: "getElements",
    value: function getElements() {
      kit = window['slider-kit'];

      if (!kit) {
        new Error('slider-kit not found');
      }

      wrapper = kit.querySelector('.slider-wrapper');

      if (!wrapper) {
        new Error('slider-wrapper not found');
      }

      items = wrapper.querySelectorAll('.slider-item');

      if (items.length < 0) {
        new Error('no slider-items found');
      }
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;

      slider.width = items[0].offsetWidth;
      slider.max = items.length - 1;
      var marginleft = window.getComputedStyle(items[0])['margin-left'];

      if (marginleft) {
        slider.width += parseInt(marginleft.substring(0, marginleft.length - 2));
      }

      var marginright = window.getComputedStyle(items[0])['margin-right'];

      if (marginright) {
        slider.width += parseInt(marginright.substring(0, marginright.length - 2));
      }

      if (slider.max * slider.width > wrapper.offsetWidth) {
        slider.maxposition = slider.max * slider.width - (wrapper.offsetWidth - slider.width);
      }

      if (navigator.userAgent.toLocaleLowerCase().indexOf('mobile') >= 0) {
        kit.addEventListener('touchstart', function (event) {
          return _this.start(event);
        }, {
          passive: false
        });
        window.addEventListener('touchmove', function (event) {
          return _this.move(event);
        }, {
          passive: false
        });
        window.addEventListener('touchend', function (event) {
          return _this.end(event);
        }, {
          passive: false
        });
      } else {
        kit.addEventListener('mousedown', function (event) {
          return _this.start(event);
        });
        window.addEventListener('mousemove', function (event) {
          return _this.move(event);
        });
        window.addEventListener('mouseup', function (event) {
          return _this.end(event);
        });
      }
    }
  }, {
    key: "start",
    value: function start(event) {
      slider.state.touch = true;
      wrapper.style.transition = '';
      slider.state.movement = false;
      slider.startX = event.clientX || event.touches[0].clientX;

      if (event.type === 'touchstart') {
        slider.startY = event.touches[0].clientY;
      }
    }
  }, {
    key: "move",
    value: function move(event) {
      if (!slider.state.touch) {
        return;
      }

      var clientX = event.clientX || event.touches[0].clientX;

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
      wrapper.style.transform = "translateX(".concat(slider.position, "px)");
    }
  }, {
    key: "end",
    value: function end() {
      if (!slider.state.touch) {
        return;
      }

      if (Math.floor(slider.position) === Math.floor(slider.end)) {
        slider.state.touch = false;
        return;
      }

      slider.state.touch = false;
      this.bounce();
    }
  }, {
    key: "bounce",
    value: function bounce(index) {
      if (index === undefined) {
        slider.index = -Math.round(slider.position / slider.width);
      } else {
        slider.index = index;
      }

      wrapper.style.transition = 'transform 250ms ease-in-out';

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
      wrapper.dataset.sliderindex = slider.index;
      wrapper.style.transform = "translateX(".concat(slider.position, "px)");
    }
  }]);

  return Sliderkit;
}();