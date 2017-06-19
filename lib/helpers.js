"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var HELPERS = exports.HELPERS = {
  Timer: function Timer(callback, delay) {
    var timerId = void 0;
    var start = void 0;
    var remaining = delay;

    this.pause = function () {
      clearTimeout(timerId);
      remaining -= new Date() - start;
    };

    this.resume = function () {
      start = new Date();
      clearTimeout(timerId);
      timerId = setTimeout(callback, remaining);
    };

    this.clear = function () {
      clearTimeout(timerId);
    };

    this.resume();
  }
};