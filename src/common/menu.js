import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'Tableau de bord',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: 'Fréquentation',
        path: 'monitor',
      },
      {
        name: 'Activités',
        path: 'analysis',
      },
      {
        name: 'Tracker',
        path: 'workplace',
        // hideInMenu: true,
      },
    ],
  },
  {
    name: 'Gestion des listes',
    icon: 'table',
    path: 'collections',
  },
  {
    name: 'Gestion de la photothèque',
    icon: 'picture',
    path: 'phototheque',
  },
  {
    name: 'Gestion des données',
    icon: 'database',
    path: 'data',
    authority: 'admin',
  },
  {
    name: 'Gestion du schéma',
    icon: 'api',
    path: 'schema',
    authority: 'admin',
    children: [
      {
        name: 'Critères',
        path: 'criteres',
      },
      {
        name: 'Valeurs possibles',
        path: 'valeurs-possibles',
      },
      {
        name: 'Sources',
        path: 'sources',
      },
    ],
  },
  {
    name: 'Documentation',
    icon: 'book',
    path: 'http://aide.floriscope.io',
    target: '_blank',
  },
  {
    name: 'Form',
    icon: 'form',
    path: 'form',
    children: [
      {
        name: 'Basic Form',
        path: 'basic-form',
      },
      {
        name: 'Step Form',
        path: 'step-form',
      },
      {
        name: 'Advanced Form (admin)',
        authority: 'admin',
        path: 'advanced-form',
      },
    ],
  },
  {
    name: 'Lists',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: 'Table List',
        path: 'table-list',
      },
      {
        name: 'Basic List',
        path: 'basic-list',
      },
      {
        name: 'Card List',
        path: 'card-list',
      },
      {
        name: 'Search',
        path: 'search',
        children: [
          {
            name: 'Articles（文章）',
            path: 'articles',
          },
          {
            name: 'Projects（项目）',
            path: 'projects',
          },
          {
            name: 'Applications（应用）',
            path: 'applications',
          },
        ],
      },
    ],
  },
  {
    name: 'Profile',
    icon: 'profile',
    path: 'profile',
    children: [
      {
        name: 'Basic',
        path: 'basic',
      },
      {
        name: 'Advanced',
        path: 'advanced',
        authority: 'admin',
      },
    ],
  },
  {
    name: 'Results',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: 'Success',
        path: 'success',
      },
      {
        name: 'Failure',
        path: 'fail',
      },
    ],
  },
  {
    name: 'Special Pages',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: 'Trigger',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'User',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: 'Login',
        path: 'login',
      },
      {
        name: 'Signup',
        path: 'register',
      },
      {
        name: 'Signup result',
        path: 'register-result',
      },
    ],
  },
  {
    name: 'Documentation',
    icon: 'book',
    path: 'http://pro.ant.design/docs/getting-started',
    target: '_blank',
  },
  {
    name: 'New',
    icon: 'plus',
    path: 'new',
  },
];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
