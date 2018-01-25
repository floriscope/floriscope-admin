import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <a href="">
      <Button size="large" type="primary">
        Vérifier votre email
      </Button>
    </a>
    <Link to="/">
      <Button size="large">Retour à l'accueil</Button>
    </Link>
  </div>
);

export default ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        Votre compte：{location.state ? location.state.account : 'AntDesign@example.com'} Enregisté
        avec succès!
      </div>
    }
    description="Un email d'activation a été envoyé à votre adresse. Cet email est valide pendant 24 heures. Veuillez vous connecter à votre messagerie afin de cliquer sur le lien d'activation."
    actions={actions}
    style={{ marginTop: 56 }}
  />
);
