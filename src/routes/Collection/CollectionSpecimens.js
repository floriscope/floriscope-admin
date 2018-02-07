import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
} from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './CollectionSpecimens.less';

moment.locale('fr');

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="Ajouter un specimen"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Taxon">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Veuillez ajouter un nom latin...' }],
        })(<Input placeholder="Ajouter un nom scientifique..." />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = (fields) => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('Specimen ajouté avec succès.');
    this.setState({
      modalVisible: false,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Identifiant">
              {getFieldDecorator('no')(<Input placeholder="Identifiant" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Statut">
              {getFieldDecorator('status')(
                <Select placeholder="Sélectionner..." style={{ width: '100%' }}>
                  <Option value="0">Publié</Option>
                  <Option value="1">Non publié</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Filtrer
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Réinitialiser
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                Plus <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Identifiant">
              {getFieldDecorator('no')(<Input placeholder="Identifiant" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Statut">
              {getFieldDecorator('status')(
                <Select placeholder="Sélectionner..." style={{ width: '100%' }}>
                  <Option value="0">Publié</Option>
                  <Option value="1">Non publié</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Code">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Date d'import">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="Définir..." />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Filtre3">
              {getFieldDecorator('status3')(
                <Select placeholder="Sélectionner..." style={{ width: '100%' }}>
                  <Option value="0">Filtre3-0</Option>
                  <Option value="1">Filtre3-1</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Filtre4">
              {getFieldDecorator('status4')(
                <Select placeholder="Sélectionner..." style={{ width: '100%' }}>
                  <Option value="0">Filtre4-0</Option>
                  <Option value="1">Filtre4-1</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              Filtrer
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              Réinitialiser
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              Moins <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    // console.log(this.props);
    const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">Supprimer</Menu.Item>
        <Menu.Item key="approval">Actualiser les correspondances</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="Titre de la liste" hideInBreadcrumb >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                Ajouter un spécimen
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>Dépublier les spécimens</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      Autres actions <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
