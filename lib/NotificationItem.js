'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _constants = require('./constants');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* From Modernizr */
var whichTransitionEvent = function whichTransitionEvent() {
  var el = document.createElement('fakeelement');
  var transition = undefined;
  var transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  };

  Object.keys(transitions).forEach(function (transitionKey) {
    if (el.style[transitionKey] !== undefined) {
      transition = transitions[transitionKey];
    }
  });

  return transition;
};

var NotificationItem = function (_Component) {
  _inherits(NotificationItem, _Component);

  function NotificationItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, NotificationItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = NotificationItem.__proto__ || Object.getPrototypeOf(NotificationItem)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      visible: undefined,
      removed: false
    }, _this._styles = {}, _this._notificationTimer = null, _this._height = 0, _this._noAnimation = null, _this._isMounted = false, _this._removeCount = 0, _this._getCssPropertyByPosition = function () {
      var position = _this.props.notification.position;

      var css = {};

      switch (position) {
        case _constants.CONSTANTS.positions.tl:
        case _constants.CONSTANTS.positions.bl:
          css = {
            property: 'left',
            value: -200
          };
          break;

        case _constants.CONSTANTS.positions.tr:
        case _constants.CONSTANTS.positions.br:
          css = {
            property: 'right',
            value: -200
          };
          break;

        case _constants.CONSTANTS.positions.tc:
          css = {
            property: 'top',
            value: -100
          };
          break;

        case _constants.CONSTANTS.positions.bc:
          css = {
            property: 'bottom',
            value: -100
          };
          break;

        default:
      }

      return css;
    }, _this._defaultAction = function (event) {
      var notification = _this.props.notification;


      event.preventDefault();
      _this._hideNotification();
      if (typeof notification.action.callback === 'function') {
        notification.action.callback();
      }
    }, _this._hideNotification = function () {
      if (_this._notificationTimer) {
        _this._notificationTimer.clear();
      }

      if (_this._isMounted) {
        _this.setState({
          visible: false,
          removed: true
        });
      }

      if (_this._noAnimation) {
        _this._removeNotification();
      }
    }, _this._removeNotification = function () {
      _this.props.onRemove(_this.props.notification.uid);
    }, _this._dismiss = function () {
      if (!_this.props.notification.dismissible) {
        return;
      }

      _this._hideNotification();
    }, _this._showNotification = function () {
      setTimeout(function () {
        if (_this._isMounted) {
          _this.setState({
            visible: true
          });
        }
      }, 50);
    }, _this._onTransitionEnd = function () {
      if (_this._removeCount > 0) return;
      if (_this.state.removed) {
        _this._removeCount++;
        _this._removeNotification();
      }
    }, _this._handleMouseEnter = function () {
      return _this.props.notification.autoDismiss && _this._notificationTimer.pause();
    }, _this._handleMouseLeave = function () {
      return _this.props.notification.autoDismiss && _this._notificationTimer.resume();
    }, _this._allowHTML = function (htmlString) {
      return { __html: htmlString };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(NotificationItem, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props,
          getStyles = _props.getStyles,
          noAnimation = _props.noAnimation,
          _props$notification = _props.notification,
          level = _props$notification.level,
          dismissible = _props$notification.dismissible;


      this._noAnimation = noAnimation;

      this._styles = {
        notification: getStyles.byElement('notification')(level),
        title: getStyles.byElement('title')(level),
        dismiss: getStyles.byElement('dismiss')(level),
        messageWrapper: getStyles.byElement('messageWrapper')(level)
      };

      if (!dismissible) {
        this._styles.notification.cursor = 'default';
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var transitionEvent = whichTransitionEvent();
      var notification = this.props.notification;
      var element = _reactDom2.default.findDOMNode(this);

      this._height = element.offsetHeight;

      this._isMounted = true;

      // Watch for transition end
      if (!this._noAnimation) {
        if (transitionEvent) {
          element.addEventListener(transitionEvent, this._onTransitionEnd);
        } else {
          this._noAnimation = true;
        }
      }

      if (notification.autoDismiss) {
        this._notificationTimer = new _helpers.HELPERS.Timer(function () {
          _this2._hideNotification();
        }, notification.autoDismiss * 1000);
      }

      this._showNotification();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      // return nextProps.notification !== this.props.notification;
      return true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var element = _reactDom2.default.findDOMNode(this);
      var transitionEvent = whichTransitionEvent();
      element.removeEventListener(transitionEvent, this._onTransitionEnd);
      this._isMounted = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          notification = _props2.notification,
          getStyles = _props2.getStyles,
          className = _props2.className,
          allowHTML = _props2.allowHTML;


      var getContentComponent = notification.getContentComponent;
      var notificationStyle = _extends({}, this._styles.notification);
      var cssByPos = this._getCssPropertyByPosition();
      var dismiss = null;
      var title = null;
      var message = null;

      var classNameSelector = (0, _classnames3.default)('notification', 'notification-' + notification.level, _defineProperty({
        'notification-visible': this.state.visible,
        'notification-hidden': !this.state.visible,
        'notification-not-dismissible': !notification.dismissible
      }, className, !!className));

      if (getStyles.overrideStyle) {
        if (!this.state.visible && !this.state.removed) {
          notificationStyle[cssByPos.property] = cssByPos.value;
        }

        if (this.state.visible && !this.state.removed) {
          notificationStyle.height = this._height;
          notificationStyle[cssByPos.property] = 0;
        }

        if (this.state.removed) {
          notificationStyle.overlay = 'hidden';
          notificationStyle.height = 0;
          notificationStyle.marginTop = 0;
          notificationStyle.paddingTop = 0;
          notificationStyle.paddingBottom = 0;
        }
        notificationStyle.opacity = this.state.visible ? 1 : 0;
      }

      if (notification.title) {
        title = _react2.default.createElement(
          'h4',
          {
            className: 'notification-title',
            style: this._styles.title },
          notification.title
        );
      }

      if (notification.message) {
        if (allowHTML) {
          message = _react2.default.createElement('div', {
            className: 'notification-message',
            style: this._styles.messageWrapper,
            dangerouslySetInnerHTML: this._allowHTML(notification.message)
          });
        } else {
          message = _react2.default.createElement(
            'div',
            {
              className: 'notification-message',
              style: this._styles.messageWrapper },
            notification.message
          );
        }
      }

      if (notification.dismissible) {
        dismiss = _react2.default.createElement(
          'span',
          {
            className: 'notification-dismiss',
            style: this._styles.dismiss },
          '\xD7'
        );
      }

      return _react2.default.createElement(
        'div',
        {
          className: classNameSelector,
          onClick: this._dismiss,
          onMouseEnter: this._handleMouseEnter,
          onMouseLeave: this._handleMouseLeave,
          style: notificationStyle
        },
        getContentComponent && getContentComponent(),
        !getContentComponent && _react2.default.createElement(
          'div',
          null,
          title,
          message,
          dismiss
        )
      );
    }
  }]);

  return NotificationItem;
}(_react.Component);

NotificationItem.propTypes = {
  notification: _propTypes2.default.shape({
    level: _propTypes2.default.string,
    title: _propTypes2.default.string,
    message: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
    dismissible: _propTypes2.default.bool,
    position: _propTypes2.default.string,
    onAdd: _propTypes2.default.func,
    onRemove: _propTypes2.default.func,
    uid: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])
  }).isRequired,
  getStyles: _propTypes2.default.object,
  onRemove: _propTypes2.default.func,
  allowHTML: _propTypes2.default.bool,
  noAnimation: _propTypes2.default.bool
};
NotificationItem.defaultProps = {
  noAnimation: false,
  onRemove: function onRemove() {},
  allowHTML: false
};
exports.default = NotificationItem;
module.exports = exports['default'];