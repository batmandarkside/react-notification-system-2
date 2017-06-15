import React, { Component }  from 'react';
import ReactDOM from 'react-dom';
import NotificationSystem from './src/NotificationSystem';
import 'styles/base.css';

class App extends Component {

  NOTIFY = null

  static defaultProps = {
    notifySettings: {
      base   : {
        level      : 'warning',
        position   : 'tr',
        message: 'base notification',
        autoDismiss: 4
      },
      success: {
        level   : 'success',
        message: 'success notification',
        position: 'tr',
      },
      error  : {
        level      : 'error',
        message: 'error notification',
        position   : 'tr',
        autoDismiss: 20,
      },
      warning: {
        level      : 'warning',
        message: 'warning notification',
        position   : 'tr',
        autoDismiss: 10000,
      },

      confirm: {
        level              : 'success',
        message: 'custom notification',
        position           : 'tr',
        autoDismiss        : 10,
        getContentComponent: () => <ConfirmNotify />
      }
    }
  }

  addNotify = (type) => {
    const { notifySettings } = this.props;
    if (type && notifySettings[type]) {
      const settings = notifySettings[type];

      this.NOTIFY.addNotification({
        ...settings
      });
    }
  }

  render() {
    return (
      <div>
        <NotificationSystem ref={el => (this.NOTIFY = el)} />

        <div>
          <button onClick={() => this.addNotify('base')}>add base</button>
          <button onClick={() => this.addNotify('success')}>add success</button>
          <button onClick={() => this.addNotify('error')}>add error</button>
          <button onClick={() => this.addNotify('warning')}>add warning</button>
          <button onClick={() => this.addNotify('confirm')}>add confirm</button>
        </div>
      </div>
    );
  }
}

const ConfirmNotify = () => (
  <div>ConfirmNotify test</div>
)

function initApp() {
  ReactDOM.render(
    <App />,
    document.querySelector('#MAIN_CONTENT')
  );
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
