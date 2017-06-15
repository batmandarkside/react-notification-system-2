import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import { CONSTANTS } from './constants';
import { HELPERS } from './helpers';

/* From Modernizr */
var whichTransitionEvent = function() {
  var el = document.createElement('fakeelement');
  var transition;
  var transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  };

  Object.keys(transitions).forEach(function(transitionKey) {
    if (el.style[transitionKey] !== undefined) {
      transition = transitions[transitionKey];
    }
  });

  return transition;
};

class NotificationItem extends Component {

  static propTypes = {
    notification: PropTypes.object,
    getStyles: PropTypes.object,
    onRemove: PropTypes.func,
    allowHTML: PropTypes.bool,
    noAnimation: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ])
  }

  static defaultProps = {
    noAnimation: false,
    onRemove: function() {},
    allowHTML: false
  }

  state = {
    visible: undefined,
    removed: false
  }

  _styles = {}

  _notificationTimer = null

  _height = 0

  _noAnimation = null

  _isMounted =false

  _removeCount = 0


  componentWillMount() {
    var getStyles = this.props.getStyles;
    var level = this.props.notification.level;

    this._noAnimation = this.props.noAnimation;

    this._styles = {
      notification: getStyles.byElement('notification')(level),
      title: getStyles.byElement('title')(level),
      dismiss: getStyles.byElement('dismiss')(level),
      messageWrapper: getStyles.byElement('messageWrapper')(level),
      actionWrapper: getStyles.byElement('actionWrapper')(level),
      action: getStyles.byElement('action')(level)
    };

    if (!this.props.notification.dismissible) {
      this._styles.notification.cursor = 'default';
    }
  }

  componentDidMount() {
    var transitionEvent = whichTransitionEvent();
    var notification = this.props.notification;
    var element = ReactDOM.findDOMNode(this);

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
      this._notificationTimer = new HELPERS.Timer(() => {
        this._hideNotification();
      }, notification.autoDismiss * 1000);
    }

    this._showNotification();
  }

  componentWillUnmount() {
    var element = ReactDOM.findDOMNode(this);
    var transitionEvent = whichTransitionEvent();
    element.removeEventListener(transitionEvent, this._onTransitionEnd);
    this._isMounted = false;
  }

  _getCssPropertyByPosition() {
    var position = this.props.notification.position;
    var css = {};

    switch (position) {
    case CONSTANTS.positions.tl:
    case CONSTANTS.positions.bl:
      css = {
        property: 'left',
        value: -200
      };
      break;

    case CONSTANTS.positions.tr:
    case CONSTANTS.positions.br:
      css = {
        property: 'right',
        value: -200
      };
      break;

    case CONSTANTS.positions.tc:
      css = {
        property: 'top',
        value: -100
      };
      break;

    case CONSTANTS.positions.bc:
      css = {
        property: 'bottom',
        value: -100
      };
      break;

    default:
    }

    return css;
  }

  _defaultAction = (event) => {
    var notification = this.props.notification;

    event.preventDefault();
    this._hideNotification();
    if (typeof notification.action.callback === 'function') {
      notification.action.callback();
    }
  }

  _hideNotification = () => {
    if (this._notificationTimer) {
      this._notificationTimer.clear();
    }

    if (this._isMounted) {
      this.setState({
        visible: false,
        removed: true
      });
    }

    if (this._noAnimation) {
      this._removeNotification();
    }
  }

  _removeNotification = () => {
    this.props.onRemove(this.props.notification.uid);
  }

  _dismiss = () => {
    if (!this.props.notification.dismissible) {
      return;
    }

    this._hideNotification();
  }

  _showNotification = () => {
    setTimeout(() => {
      if (this._isMounted) {
        this.setState({
          visible: true
        });
      }
    }, 50);
  }

  _onTransitionEnd = () => {
    if (this._removeCount > 0) return;
    if (this.state.removed) {
      this._removeCount++;
      this._removeNotification();
    }
  }


  _handleMouseEnter = () => {
    var notification = this.props.notification;
    if (notification.autoDismiss) {
      this._notificationTimer.pause();
    }
  }

  _handleMouseLeave = () => {
    var notification = this.props.notification;
    if (notification.autoDismiss) {
      this._notificationTimer.resume();
    }
  }


  _allowHTML = string => ({ __html: string })

  render() {
    var notification = this.props.notification;
    var notificationStyle = { ...this._styles.notification };
    var cssByPos = this._getCssPropertyByPosition();
    var dismiss = null;
    var actionButton = null;
    var title = null;
    var message = null;
    var content = null;
    var getContentComponent = notification.getContentComponent;

    var className = classnames('notification', 'notification-' + notification.level, {
      'notification-visible': this.state.visible,
      'notification-hidden': !this.state.visible,
      'notification-not-dismissible': !notification.dismissible,
      [this.props.className]: !!this.props.className
    });

    if (this.props.getStyles.overrideStyle) {
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
      notificationStyle.opacity = this.state.visible
        ? this._styles.notification.isVisible.opacity
        : this._styles.notification.isHidden.opacity;
    }

    if (notification.title) {
      title = (
        <h4
          className="notification-title"
          style={ this._styles.title }>
          { notification.title }
        </h4>
      );
    }

    if (notification.message) {
      if (this.props.allowHTML) {
        message = (
          <div
            className="notification-message"
            style={ this._styles.messageWrapper }
            dangerouslySetInnerHTML={ this._allowHTML(notification.message) }
          />
        );
      } else {
        message = (
          <div
            className="notification-message"
            style={ this._styles.messageWrapper }>
            { notification.message }
          </div>
        );
      }
    }

    if (notification.dismissible) {
      dismiss = (
        <span
          className="notification-dismiss"
          style={ this._styles.dismiss }>
          &times;
        </span>
      );
    }

    if (notification.action) {
      actionButton = (
        <div
          className="notification-action-wrapper"
          style={ this._styles.actionWrapper }>
          <button className="notification-action-button"
            onClick={ this._defaultAction }
            style={ this._styles.action }>
              { notification.action.label }
          </button>
        </div>
      );
    }

    if (notification.children) {
      actionButton = notification.children;
    }

    if (getContentComponent) {
      content = getContentComponent();
    } else {
      content = (
        <div>
          {title}
          {message}
          {dismiss}
          {actionButton}
        </div>
      );
    }

    return (
      <div
        className={ className }
        onClick={ this._dismiss }
        onMouseEnter={ this._handleMouseEnter }
        onMouseLeave={ this._handleMouseLeave }
        style={ notificationStyle }
      >
        {getContentComponent && getContentComponent()}
        {!getContentComponent && content}
      </div>
    );
  }

};

export default NotificationItem;
