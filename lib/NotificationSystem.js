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

var _NotificationContainer = require('./NotificationContainer');

var _NotificationContainer2 = _interopRequireDefault(_NotificationContainer);

var _constants = require('./constants');

var _styles = require('./styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationSystem = function (_Component) {
  _inherits(NotificationSystem, _Component);

  function NotificationSystem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, NotificationSystem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = NotificationSystem.__proto__ || Object.getPrototypeOf(NotificationSystem)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      notifications: []
    }, _this.uid = 3400, _this._isMounted = false, _this._getStyles = {
      overrideStyle: {},

      overrideWidth: null,

      setOverrideStyle: function setOverrideStyle(style) {
        this.overrideStyle = style;
      },
      wrapper: function wrapper() {
        if (!this.overrideStyle) return {};
        return _extends({}, _styles.STYLES.Wrapper, this.overrideStyle.Wrapper);
      },
      container: function container(position) {
        var override = this.overrideStyle.Containers || {};
        if (!this.overrideStyle) return {};

        this.overrideWidth = _styles.STYLES.Containers.DefaultStyle.width;

        if (override.DefaultStyle && override.DefaultStyle.width) {
          this.overrideWidth = override.DefaultStyle.width;
        }

        if (override[position] && override[position].width) {
          this.overrideWidth = override[position].width;
        }

        return _extends({}, _styles.STYLES.Containers.DefaultStyle, _styles.STYLES.Containers[position], override.DefaultStyle, override[position]);
      },


      elements: {
        notification: 'NotificationItem',
        title: 'Title',
        messageWrapper: 'MessageWrapper',
        dismiss: 'Dismiss',
        action: 'Action',
        actionWrapper: 'ActionWrapper'
      },

      byElement: function byElement(element) {
        var _this2 = this;

        return function (level) {
          var _element = _this2.elements[element];
          var override = _this2.overrideStyle[_element] || {};
          if (!_this2.overrideStyle) return {};
          return _extends({}, _styles.STYLES[_element].DefaultStyle, _styles.STYLES[_element][level], override.DefaultStyle, override[level]);
        };
      }
    }, _this._didNotificationRemoved = function (uid) {
      var notifications = _this.state.notifications;

      var notificationsFiltered = notifications.filter(function (toCheck) {
        return toCheck.uid === uid;
      });
      var notificationFound = notifications.find(function (toCheck) {
        return toCheck.uid === uid;
      });

      if (_this._isMounted) {
        _this.setState({
          notifications: notificationsFiltered
        });
      }

      if (notificationFound && notificationFound.onRemove) {
        notificationFound.onRemove(notificationFound);
      }
    }, _this.addNotification = function (notification) {
      var _notification = _extends({}, _constants.CONSTANTS.notification, notification);
      var notifications = _this.state.notifications;
      var i = void 0;
      var getContentComponent = _notification.getContentComponent;

      if (!_notification.level && !getContentComponent) {
        throw new Error('notification level is required.');
      }

      if (Object.keys(_constants.CONSTANTS.levels).indexOf(_notification.level) === -1 && !getContentComponent) {
        throw new Error('\'' + _notification.level + '\' is not a valid level.');
      }

      if (isNaN(_notification.autoDismiss)) {
        throw new Error('\'autoDismiss\' must be a number.');
      }

      if (Object.keys(_constants.CONSTANTS.positions).indexOf(_notification.position) === -1) {
        throw new Error('\'' + _notification.position + '\' is not a valid position.');
      }

      if (!getContentComponent) {
        _notification.level = _notification.level.toLowerCase();
      }

      // Some preparations
      _notification.position = _notification.position.toLowerCase();
      _notification.autoDismiss = parseInt(_notification.autoDismiss, 10);

      _notification.uid = _notification.uid || _this.uid;
      _notification.ref = 'notification-' + _notification.uid;
      _this.uid += 1;

      // do not add if the notification already exists based on supplied uid
      for (i = 0; i < notifications.length; i++) {
        if (notifications[i].uid === _notification.uid) {
          return false;
        }
      }

      notifications.push(_notification);

      if (typeof _notification.onAdd === 'function') {
        notification.onAdd(_notification);
      }

      _this.setState({
        notifications: notifications
      });

      return _notification;
    }, _this.getNotificationRef = function (notification) {
      var foundNotification = null;

      Object.keys(_this.refs).forEach(function (container) {
        var _this3 = this;

        if (container.indexOf('container') > -1) {
          Object.keys(this.refs[container].refs).forEach(function (_notification) {
            var uid = notification.uid ? notification.uid : notification;
            if (_notification === 'notification-' + uid) {
              // NOTE: Stop iterating further and return the found notification.
              // Since UIDs are uniques and there won't be another notification found.
              foundNotification = _this3.refs[container].refs[_notification];
              return;
            }
          });
        }
      });

      return foundNotification;
    }, _this.removeNotification = function (notification) {
      var foundNotification = _this.getNotificationRef(notification);
      return foundNotification && foundNotification._hideNotification();
    }, _this.editNotification = function (notification, newNotification) {
      var notifications = _this.state.notifications;

      var foundNotification = null;
      // NOTE: Find state notification to update by using
      // `setState` and forcing React to re-render the component.
      var uid = notification.uid ? notification.uid : notification;

      var newNotifications = notifications.filter(function (stateNotification) {
        if (uid === stateNotification.uid) {
          foundNotification = stateNotification;
          return false;
        }

        return true;
      });

      if (!foundNotification) {
        return;
      }

      newNotifications.push(_extends({}, foundNotification, newNotification));

      _this.setState({
        notifications: newNotifications
      });
    }, _this.clearNotifications = function () {
      Object.keys(_this.refs).forEach(function (container) {
        if (container.indexOf('container') > -1) {
          Object.keys(_this.refs[container].refs).forEach(function (_notification) {
            _this.refs[container].refs[_notification]._hideNotification();
          });
        }
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(NotificationSystem, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._getStyles.setOverrideStyle(this.props.style);
      this._isMounted = true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          className = _props.className,
          noAnimation = _props.noAnimation,
          allowHTML = _props.allowHTML;

      var containers = null;
      var notifications = this.state.notifications;


      var classNameSelector = (0, _classnames3.default)('notifications-wrapper', _defineProperty({}, className, !!className));

      if (notifications.length) {
        containers = Object.keys(_constants.CONSTANTS.positions).map(function (position, i) {
          var _notifications = notifications.filter(function (notification) {
            return position === notification.position;
          });

          if (!_notifications.length) {
            return null;
          }

          return _react2.default.createElement(_NotificationContainer2.default, {
            ref: 'container-' + position,
            key: i + '-' + position,
            position: position,
            notifications: _notifications,
            getStyles: _this4._getStyles,
            onRemove: _this4._didNotificationRemoved,
            noAnimation: noAnimation,
            allowHTML: allowHTML
          });
        });
      }

      return _react2.default.createElement(
        'div',
        {
          className: classNameSelector,
          style: this._getStyles.wrapper()
        },
        containers
      );
    }
  }]);

  return NotificationSystem;
}(_react.Component);

NotificationSystem.propTypes = {
  style: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.object]),
  noAnimation: _propTypes2.default.bool,
  allowHTML: _propTypes2.default.bool
};
NotificationSystem.defaultProps = {
  style: {},
  noAnimation: false,
  allowHTML: false
};
exports.default = NotificationSystem;
module.exports = exports['default'];