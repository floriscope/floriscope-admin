import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';

const { AuthorizedRoute } = Authorized;

const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class NestedLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Floriscope - Admin';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Floriscope`;
    }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      return '/collections/all';
    }
    return redirect;
  };

  render() {
    const { routerData, match } = this.props;
    const bashRedirect = this.getBashRedirect();
    const layout = (
      <Switch>
        {redirectData.map(item => <Redirect key={item.from} exact from={item.from} to={item.to} />)}
        {getRoutes(match.path, routerData).map(item => (
          <AuthorizedRoute
            key={item.key}
            path={item.path}
            component={item.component}
            exact={item.exact}
            authority={item.authority}
            redirectPath="/exception/403"
          />
        ))}
        <Redirect exact from="/" to={bashRedirect} />
        <Route render={NotFound} />
      </Switch>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default NestedLayout;
