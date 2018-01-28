import React, { PureComponent } from 'react';

export default class IllustrationPreview extends PureComponent {
  componentWillMount() {
    console.log(this.props);
  }

  render() {
    return (
      <div>
        <div key={this.props.match.params.uuid}>
          Illustration Preview with ID: {this.props.match.params.uuid}
        </div>
      </div>
    );
  }
}
