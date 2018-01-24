import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = (type) => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    console.log('Submit form');
    console.log(values);
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = (content) => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="Email">
            {login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage('Email ou mot de passe incorrect（admin/888888）')}
            <UserName name="userName" placeholder="admin/editor/user" />
            <Password name="password" placeholder="888888/666666/123456" />
          </Tab>
          <Tab key="mobile" tab="SMS">
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !login.submitting &&
              this.renderMessage('Code de vérification incorrect')}
            <Mobile name="mobile" />
            <Captcha name="captcha" />
          </Tab>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              Rester connecté?
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              Mot de passe oublié
            </a>
          </div>
          <Submit loading={submitting}>Connexion</Submit>
          <div className={styles.other}>
            Me connecter avec
            <Icon className={styles.icon} type="facebook" />
            <Icon className={styles.icon} type="linkedin" />
            <Icon className={styles.icon} type="github" />
            <Link className={styles.register} to="/user/register">
              Créer un compte
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}
