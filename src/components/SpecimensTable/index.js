import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './index.less';

const statusMap = ['default', 'processing', 'success', 'error'];
class SpecimenTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const confidence = ['unknown_confidence', 'failure', 'low', 'medium', 'high'];

    const columns = [
      {
        title: 'ID',
        dataIndex: 'no',
      },
      {
        title: 'Description',
        dataIndex: 'description',
      },
      {
        title: 'callNo',
        dataIndex: 'callNo',
        sorter: true,
        align: 'right',
        render: val => `${val} 万`,
      },
      {
        title: 'Confidence',
        dataIndex: 'status',
        filters: [
          {
            text: confidence[0],
            value: 0,
          },
          {
            text: confidence[1],
            value: 1,
          },
          {
            text: confidence[2],
            value: 2,
          },
          {
            text: confidence[3],
            value: 3,
          },
        ],
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: 'Opération',
        render: () => (
          <Fragment>
            <a href="">Configurer</a>
            <Divider type="vertical" />
            <a href="">Me notifier</a>
          </Fragment>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
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
                Total des appels de service <span style={{ fontWeight: 600 }}>{totalCallNo}</span> 万
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
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default SpecimenTable;
