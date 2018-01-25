import React from 'react';
import { Input, Icon } from 'antd';
import styles from './index.less';

const map = {
  UserName: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: 'Veuillez saisir un email!',
      },
    ],
  },
  Password: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: 'Veuillez saisir un mot de passe！',
      },
    ],
  },
  Mobile: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: 'Numéro de téléphone',
    },
    rules: [
      {
        required: true,
        message: 'Veuillez entrer un numéro de téléphone！',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Format de numéro de téléphone incorrect！',
      },
    ],
  },
  Captcha: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: 'Code de vérification',
    },
    rules: [
      {
        required: true,
        message: 'Veuillez saisir votre code de vérification！',
      },
    ],
  },
};

export default map;
