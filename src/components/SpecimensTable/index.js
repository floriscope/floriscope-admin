import React, { PureComponent, Fragment } from 'react';
// import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import _ from 'lodash';
import styles from './index.less';

// const statusMap = ['default', 'processing', 'success', 'error'];
const statusMap = {
  unknownConfidence: 'default',
  failure: 'error',
  low: 'error',
  medium: 'processing',
  high: 'success',
};
class SpecimenTable extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    // const totalCallNo = selectedRows.reduce((sum, val) => {
    //   return sum + parseFloat(val.callNo, 10);
    // }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { data: { specimens, meta }, loading } = this.props;

    const confidence = {
      unknownConfidence: 'Inconnue',
      failure: 'Échec',
      low: 'Faible',
      medium: 'Moyenne',
      high: 'Forte',
    };

    const columns = [

      {
        title: 'Désignation originale',
        dataIndex: 'original',
      },
      {
        title: 'Confidence',
        dataIndex: 'confidence',
        filters: [
          {
            text: confidence.unknownConfidence,
            value: 'unknown_confidence',
          },
          {
            text: confidence.failure,
            value: 'failure',
          },
          {
            text: confidence.low,
            value: 'low',
          },
          {
            text: confidence.medium,
            value: 'medium',
          },
          {
            text: confidence.high,
            value: 'high',
          },
        ],
        render(val) {
          return <Badge status={statusMap[_.camelCase(val)]} text={confidence[_.camelCase(val)]} />;
        },
      },
      {
        title: 'Plante associée',
        dataIndex: 'match',
      },
      {
        title: 'Actions',
        render: () => (
          <Fragment>
            <a href="">Voir</a>
            <Divider type="vertical" />
            <a href="">Plus</a>
          </Fragment>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: meta ? meta.pagination.perPage : 5,
      total: meta ? meta.pagination.totalObjects : 25,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>
                &nbsp;Spécimens&nbsp;&nbsp;sélectionnés
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>Vider</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={specimens}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default SpecimenTable;
