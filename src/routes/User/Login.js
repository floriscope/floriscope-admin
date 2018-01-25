import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';
import { getAuthority, clearCurrentUser } from '../../utils/authority';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ signin, loading }) => ({
  signin,
  submitting: loading.effects['signin/signin'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  componentDidMount() {
    const authority = getAuthority();
    if (authority === 'guest') {
      clearCurrentUser();
    }
  }

  onTabChange = (type) => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'signin/signin',
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
    const { signin, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="Email">
            {signin.httpCode === 401 &&
              signin.type === 'account' &&
              !signin.submitting &&
              this.renderMessage('Email ou mot de passe incorrect')}
            <UserName name="email" placeholder="Adresse électronique" />
            <Password name="password" placeholder="Mot de passe" />
          </Tab>
          <Tab key="mobile" tab="SMS">
            {signin.httpCode === 401 &&
              signin.type === 'mobile' &&
              !signin.submitting &&
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
