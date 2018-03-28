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
    path: 'collections/all',
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
    name: 'Me connecter',
    icon: 'user',
    path: 'user/login',
    authority: 'guest',
  },
  {
    name: 'Documentation',
    icon: 'book',
    path: 'http://aide.floriscope.io',
    target: '_blank',
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
