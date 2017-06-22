import React, { Component }  from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import NotificationSystem from './src/NotificationSystem';
import 'styles/example.css';
import 'styles/base.css';


const Layout = styled.div`
      width: 1000px;
      margin: 0 auto;
      padding-top:30px;
    `;

const Overlay = styled.div`      
      background: url(${require('./assets/images/congruent_pentagon.png')}) top left repeat;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.3;
      background-attachment: fixed;
    `;

const Content = styled.div`
      text-align: center;
      margin-bottom: 20px;
    `;

const Title = styled.h1`
      font-size: 64px;
      letter-spacing: -1px;
      color: #FFF;
      margin-top: 15px;
      margin-bottom: 15px;
    `;

const TitleH2 = Title.extend`
      font-size: 28px;     
    `;

const Button = styled.span`
      font-size: 16px;
      text-align: center;
      color: #fff;
      padding: 10px;
      background-color: #6060e8;
      margin-bottom: 15px;
      margin-right: 15px;
      display: inline-block;
      width: 100px;
      cursor: pointer;
    `;

const Buttons = styled.div`
      position: relative;
      text-align: center;
    `;


const ConfirmNotify = () => (
  <div>ConfirmNotify test</div>
);

class App extends Component {

  NOTIFY = null

  static defaultProps = {
    notifySettings: {
      base   : {
        level      : 'warning',
        position   : 'tr',
        message    : 'base notification',
        autoDismiss: 20
      },
      success: {
        level   : 'success',
        message : 'success notification',
        position: 'tr',
      },
      error  : {
        level      : 'error',
        message    : 'error notification',
        position   : 'tr',
        autoDismiss: 20,
      },
      warning: {
        level      : 'warning',
        message    : <ConfirmNotify />,
        position   : 'tr',
        allowHTML: true,
        autoDismiss: 10000,
      },

      confirm: {
        level              : 'success',
        message            : 'custom notification',
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
      <Layout>
        <Overlay />
        <NotificationSystem
          noAnimation
          ref={el => (this.NOTIFY = el)}
        />

        <Content>
          <Title>React Notification System</Title>
          <TitleH2>A complete and totally customizable component for notifications in React.</TitleH2>
        </Content>
        <Buttons>
          <Button onClick={() => this.addNotify('base')}>add base</Button>
          <Button onClick={() => this.addNotify('success')}>add success</Button>
          <Button onClick={() => this.addNotify('error')}>add error</Button>
          <Button onClick={() => this.addNotify('warning')}>add warning</Button>
          <Button onClick={() => this.addNotify('confirm')}>add confirm</Button>
        </Buttons>
      </Layout>
    );
  }
}


function initApp() {
  ReactDOM.render(
    <App />,
    document.querySelector('#MAIN_CONTENT')
  );
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
