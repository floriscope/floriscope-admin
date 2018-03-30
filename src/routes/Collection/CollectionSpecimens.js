import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
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
import { keysToCamelCase } from '../../utils/utils';
// import StandardTable from '../../components/StandardTable';
import SpecimensTable from '../../components/SpecimensTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './CollectionSpecimens.less';

moment.locale('fr');

const ButtonGroup = Button.Group;
const { RangePicker } = DatePicker;

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

@connect(({ collection, loading }) => ({
  collection,
  loading: loading.models.collection,
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
      type: 'collection/fetchOne',
      payload: {
        uuid: this.props.match.params.uuid,
      },
    });
    dispatch({
      type: 'collection/fetchSpecimens',
      payload: {
        uuid: this.props.match.params.uuid,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    console.log(pagination);

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
      type: 'collection/fetchSpecimens',
      payload: {
        uuid: this.props.match.params.uuid,
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
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

  handleAdd = () => {
    // this.props.dispatch({
    //   type: 'rule/add',
    //   payload: {
    //     description: fields.desc,
    //   },
    // });

    message.success('Specimen ajouté avec succès.');
    this.setState({
      modalVisible: false,
    });
  };

  backToCollectionIndex = () => {
    this.props.dispatch(routerRedux.push('/collections/all'));
  }

  goToCollectionEdit = () => {
    this.props.dispatch(routerRedux.push(`/c/${this.props.match.params.uuid}/edit`));
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
            <FormItem label="Mode">
              {getFieldDecorator('mode')(
                <Select placeholder="Sélectionner..." style={{ width: '100%' }}>
                  <Option value="0">Autocomplete</Option>
                  <Option value="1">Import (CSV, Excel)</Option>
                  <Option value="2">Correction manuelle</Option>
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
            <FormItem label="Mode">
              {getFieldDecorator('mode')(
                <Select placeholder="Sélectionner..." style={{ width: '100%' }}>
                  <Option value="0">Autocomplete</Option>
                  <Option value="1">Import (CSV, Excel)</Option>
                  <Option value="2">Correction manuelle</Option>
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
          <Col md={16} sm={24}>
            <FormItem label="Date d'import">
              {getFieldDecorator('date')(
                <RangePicker style={{ width: '100%' }} placeholder={['Date de début', 'Date de fin']} />
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
    const { loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const { collection } = keysToCamelCase(this.props.collection);
    const { specimens } = keysToCamelCase(this.props.collection);
    // console.log(this.props);

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

    const headerMenu = (
      <Menu>
        <Menu.Item key="1">Import par lot</Menu.Item>
        <Menu.Item key="2">Gestion en mode carte</Menu.Item>
      </Menu>
    );

    const action = (
      <div>
        <ButtonGroup>
          <Button icon="left" onClick={this.backToCollectionIndex}>Retour</Button>
          <Button type="primary" onClick={this.goToCollectionEdit}>Editer</Button>
          <Dropdown overlay={headerMenu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
      </div>
    );

    return (
      <PageHeaderLayout
        title={collection ? collection.title : ''}
        logo={<img alt="" src={collection ? collection.imageThumbnail : ''} style={{ objectFit: 'cover' }} />}
        action={action}
        hideInBreadcrumb
      >
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
            {specimens.specimens && (
              <SpecimensTable
                selectedRows={selectedRows}
                loading={loading}
                data={specimens}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
              )
            }
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
