import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import NotificationContainer from './NotificationContainer';
import { CONSTANTS } from './constants';
import { STYLES } from './styles';

class NotificationSystem extends Component {

  static propTypes = {
    style: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]),
    noAnimation: PropTypes.bool,
    allowHTML: PropTypes.bool
  }

  static defaultProps = {
    style: {},
    noAnimation: false,
    allowHTML: false
  }

  state = {
    notifications: []
  }

  componentDidMount() {
    this._getStyles.setOverrideStyle(this.props.style);
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  uid = 3400

  _isMounted = false

  _getStyles = {
    overrideStyle: {},

    overrideWidth: null,

    setOverrideStyle(style) {
      this.overrideStyle = style;
    },

    wrapper() {
      if (!this.overrideStyle) return {};
      return {
        ...STYLES.Wrapper,
        ...this.overrideStyle.Wrapper
      };
    },

    container(position) {
      const override = this.overrideStyle.Containers || {};
      if (!this.overrideStyle) return {};

      this.overrideWidth = STYLES.Containers.DefaultStyle.width;

      if (override.DefaultStyle && override.DefaultStyle.width) {
        this.overrideWidth = override.DefaultStyle.width;
      }

      if (override[position] && override[position].width) {
        this.overrideWidth = override[position].width;
      }

      return {
        ...STYLES.Containers.DefaultStyle,
        ...STYLES.Containers[position],
        ...override.DefaultStyle,
        ...override[position]
      };
    },

    elements: {
      notification: 'NotificationItem',
      title: 'Title',
      messageWrapper: 'MessageWrapper',
      dismiss: 'Dismiss',
      action: 'Action',
      actionWrapper: 'ActionWrapper'
    },

    byElement(element) {
      return (level) => {
        const _element = this.elements[element];
        const override = this.overrideStyle[_element] || {};
        if (!this.overrideStyle) return {};
        return {
          ...STYLES[_element].DefaultStyle,
          ...STYLES[_element][level],
          ...override.DefaultStyle,
          ...override[level]
        };
      };
    }
  }

  _didNotificationRemoved = (uid) => {
    const { notifications } = this.state;
    const notificationsFiltered = notifications.filter((toCheck) => toCheck.uid !== uid);
    const notificationFound = notifications.find((toCheck) => toCheck.uid === uid);

    if (this._isMounted) {
      this.setState({
        notifications: notificationsFiltered
      });
    }

    if (notificationFound && notificationFound.onRemove) {
      notificationFound.onRemove(notificationFound);
    }
  }


  addNotification = (notification) => {
    const _notification = {
      ...CONSTANTS.notification,
      ...notification
    };
    const notifications = this.state.notifications;
    let i;
    const getContentComponent = _notification.getContentComponent;

    if (!_notification.level && !getContentComponent) {
      throw new Error('notification level is required.');
    }

    if ((Object.keys(CONSTANTS.levels).indexOf(_notification.level) === -1) && !getContentComponent) {
      throw new Error('\'' + _notification.level + '\' is not a valid level.');
    }

    if (isNaN(_notification.autoDismiss)) {
      throw new Error('\'autoDismiss\' must be a number.');
    }

    if (Object.keys(CONSTANTS.positions).indexOf(_notification.position) === -1) {
      throw new Error('\'' + _notification.position + '\' is not a valid position.');
    }

    if (!getContentComponent) {
      _notification.level = _notification.level.toLowerCase();
    }

    // Some preparations
    _notification.position = _notification.position.toLowerCase();
    _notification.autoDismiss = parseInt(_notification.autoDismiss, 10);

    _notification.uid = _notification.uid || this.uid;
    _notification.ref = `notification-${_notification.uid}`;
    this.uid += 1;

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

    this.setState({
      notifications: notifications
    });

    return _notification;
  }

  getNotificationRef = (notification) => {
    let foundNotification = null;

    Object.keys(this.refs).forEach((container) => {
      if (container.indexOf('container') > -1) {
        Object.keys(this.refs[container].refs).forEach((_notification) => {
          const uid = notification.uid ? notification.uid : notification;
          if (_notification === `notification-${uid}`) {
            // NOTE: Stop iterating further and return the found notification.
            // Since UIDs are uniques and there won't be another notification found.
            foundNotification = this.refs[container].refs[_notification];
            return;
          }
        });
      }
    });

    return foundNotification;
  }

  removeNotification = (notification) => {
    const foundNotification = this.getNotificationRef(notification);
    return foundNotification && foundNotification._hideNotification();
  }

  editNotification = (notification, newNotification) => {
    const { notifications } = this.state;
    let foundNotification = null;
    // NOTE: Find state notification to update by using
    // `setState` and forcing React to re-render the component.
    const uid = notification.uid ? notification.uid : notification;

    const newNotifications = notifications.filter((stateNotification) => {
      if (uid === stateNotification.uid) {
        foundNotification = stateNotification;
        return false;
      }

      return true;
    });


    if (!foundNotification) {
      return;
    }

    newNotifications.push({
      ...foundNotification,
      ...newNotification
    });

    this.setState({
      notifications: newNotifications
    });
  }

  clearNotifications = () => {
    Object.keys(this.refs).forEach((container) => {
      if (container.indexOf('container') > -1) {
        Object.keys(this.refs[container].refs).forEach((_notification) => {
          this.refs[container].refs[_notification]._hideNotification();
        });
      }
    });
  }

  render() {
    const { className, noAnimation, allowHTML } = this.props;
    let containers = null;
    const { notifications } = this.state;

    const classNameSelector = classnames(
      'notifications-wrapper', {
        [className]: !!className
      }
    );

    if (notifications.length) {
      containers = Object.keys(CONSTANTS.positions).map((position, i) => {
        const _notifications = notifications.filter(notification => position === notification.position);

        if (!_notifications.length) {
          return null;
        }

        return (
          <NotificationContainer
            ref={`container-${position}`}
            key={`${i}-${position}`}
            position={position}
            notifications={_notifications}
            getStyles={this._getStyles}
            onRemove={this._didNotificationRemoved}
            noAnimation={ noAnimation }
            allowHTML={ allowHTML }
          />
        );
      });
    }


    return (
      <div
        className={classNameSelector}
        style={this._getStyles.wrapper()}
      >
        { containers }
      </div>
    );
  }
}

export default NotificationSystem;
