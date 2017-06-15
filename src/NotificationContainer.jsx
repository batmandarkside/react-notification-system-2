import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotificationItem from './NotificationItem';
import { CONSTANTS } from './constants';
import classnames from 'classnames';

class NotificationContainer extends Component {

  static propTypes = {
    position: PropTypes.string.isRequired,
    notifications: PropTypes.array.isRequired,
    classNameContainer: PropTypes.string,
    getStyles: PropTypes.object
  }

  _style = {}

  componentWillMount() {
    // Fix position if width is overrided
    this._style = this.props.getStyles.container(this.props.position);

    if (
      this.props.getStyles.overrideWidth &&
      (this.props.position === CONSTANTS.positions.tc || this.props.position === CONSTANTS.positions.bc))
    {
      this._style.marginLeft = -(this.props.getStyles.overrideWidth / 2);
    }
  }

  render() {
    let notifications;
    const classNameContainer = this.props.classNameContainer;

    const classNameSelector = classnames(
      'notification-container',
      'notifications-' + this.props.position, {
        [classNameContainer]: !!classNameContainer
      }
    );

    if ([CONSTANTS.positions.bl, CONSTANTS.positions.br, CONSTANTS.positions.bc].indexOf(this.props.position) > -1) {
      this.props.notifications.reverse();
    }

    notifications = this.props.notifications.map((notification, i) => (
      <NotificationItem
        ref={ `notification-${notification.uid}` }
        key={ `${notification.uid}-${i}` }
        className={ notification.className }
        notification={ notification }
        getStyles={ this.props.getStyles }
        onRemove={ this.props.onRemove }
        noAnimation={ this.props.noAnimation }
        allowHTML={ this.props.allowHTML }
        children={ this.props.children }
      />
    ));

    return (
      <div className={ classNameSelector } style={ this._style }>
        { notifications }
      </div>
    );
  }
};


module.exports = NotificationContainer;
