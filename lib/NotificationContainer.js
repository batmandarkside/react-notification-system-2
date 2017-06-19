'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _NotificationItem = require('./NotificationItem');

var _NotificationItem2 = _interopRequireDefault(_NotificationItem);

var _constants = require('./constants');

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationContainer = function (_Component) {
  _inherits(NotificationContainer, _Component);

  function NotificationContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, NotificationContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = NotificationContainer.__proto__ || Object.getPrototypeOf(NotificationContainer)).call.apply(_ref, [this].concat(args))), _this), _this._style = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(NotificationContainer, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // Fix position if width is overrided
      this._style = this.props.getStyles.container(this.props.position);

      if (this.props.getStyles.overrideWidth && (this.props.position === _constants.CONSTANTS.positions.tc || this.props.position === _constants.CONSTANTS.positions.bc)) {
        this._style.marginLeft = -(this.props.getStyles.overrideWidth / 2);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var notifications = void 0;
      var classNameContainer = this.props.classNameContainer;

      var classNameSelector = (0, _classnames3.default)('notification-container', 'notifications-' + this.props.position, _defineProperty({}, classNameContainer, !!classNameContainer));

      if ([_constants.CONSTANTS.positions.bl, _constants.CONSTANTS.positions.br, _constants.CONSTANTS.positions.bc].indexOf(this.props.position) > -1) {
        this.props.notifications.reverse();
      }

      notifications = this.props.notifications.map(function (notification, i) {
        return _react2.default.createElement(_NotificationItem2.default, {
          ref: 'notification-' + notification.uid,
          key: notification.uid + '-' + i,
          className: notification.className,
          notification: notification,
          getStyles: _this2.props.getStyles,
          onRemove: _this2.props.onRemove,
          noAnimation: _this2.props.noAnimation,
          allowHTML: _this2.props.allowHTML
        });
      });

      return _react2.default.createElement(
        'div',
        { className: classNameSelector, style: this._style },
        notifications
      );
    }
  }]);

  return NotificationContainer;
}(_react.Component);

NotificationContainer.propTypes = {
  position: _propTypes2.default.string.isRequired,
  notifications: _propTypes2.default.array.isRequired,
  classNameContainer: _propTypes2.default.string,
  getStyles: _propTypes2.default.object
};
exports.default = NotificationContainer;
module.exports = exports['default'];