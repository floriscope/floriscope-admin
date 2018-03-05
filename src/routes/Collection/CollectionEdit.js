import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button } from 'antd';

@connect()

export default class CollectionEdit extends PureComponent {
  componentWillMount() {
    // console.log(this.props);
  }
  backToCollectionIndex = () => {
    this.props.dispatch(routerRedux.push('/collections/all'));
  }
  render() {
    return (
      <div>
        <Button icon="left" onClick={this.backToCollectionIndex}>Retour aux listes</Button>
        <div key={this.props.match.params.uuid}>
          Collection {this.props.match.params.uuid} Edit page
        </div>
      </div>
    );
  }
}
