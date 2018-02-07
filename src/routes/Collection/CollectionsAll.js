import {
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Form,
  Icon,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Select,
  Switch,
  Upload,
  notification,
} from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getCurrentUser } from '../../utils/authority';
import { keysToCamelCase } from '../../utils/utils';
import styles from './CollectionsAll.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  const handleChange = (value) => {
    // console.log(`selected ${value}`);
    notification.open({
      message: 'Select Notification (temp)',
      description: `selected ${value}`,
    });
  };
  const handleBlur = () => {
    // console.log('blur');
  };
  const handleFocus = () => {
    // console.log('focus');
  };
  return (
    <Modal
      title="Ajouter une nouvelle liste"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      okText="Valider"
      cancelText="Annuler"
    >
      <FormItem>
        <div className="dropbox">
          {form.getFieldDecorator('cover', {
            valuePropName: 'cover',
            getValueFromEvent: this.normFile,
          })(
            <Upload.Dragger name="files">
              <p className="ant-upload-drag-icon">
                <Icon type="picture" />
              </p>
              <p className="ant-upload-text">Cliquer ou glisser-déposer une image à télécharger</p>
              <p className="ant-upload-hint">
                Formats autorisé .JPG, .PNG, .SVG, .GIG. Dimensions recommandées...
              </p>
            </Upload.Dragger>
          )}
        </div>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Titre">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: 'Veuillez ajouter un titre...' }],
        })(<Input placeholder="Titre de la liste" />)}
      </FormItem>
      <FormItem hasFeedback labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Catégorie">
        {form.getFieldDecorator('category', {
          rules: [{ required: true, message: 'Veuillez ajouter une catégorie...' }],
        })(
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Sélectionner une catégorie"
            optionFilterProp="children"
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="Catalogue">Catalogue</Option>
            <Option value="Aménagement paysager">Aménagement paysager</Option>
            <Option value="Liste thématique">Liste thématique</Option>
            <Option value="Colllection botanique">Colllection botanique</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Mots-clés">
        {form.getFieldDecorator('tags')(
          <Select
            mode="tags"
            showSearch
            style={{ width: '100%' }}
            placeholder="Ajouter des mots-clés"
            optionFilterProp="children"
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="Vivaces">Vivaces</Option>
            <Option value="Gestion écologique">Gestion écologique</Option>
            <Option value="Conseil de plantation">Conseil de plantation</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        label="Publier"
        style={{ width: '100%' }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
      >
        {form.getFieldDecorator('isPublished', { valuePropName: 'checked' })(<Switch />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ collection, loading }) => ({
  collection,
  loading: loading.models.collection,
}))
@Form.create()
export default class CollectionsAll extends PureComponent {
  state = {
    modalVisible: false,
    // expandForm: false,
    // formValues: {},
  };

  componentDidMount() {
    const currentUser = keysToCamelCase(JSON.parse(getCurrentUser()));
    // console.log(keysToCamelCase(currentUser));
    // console.log(currentUser);
    const { authToken } = currentUser;
    this.props.dispatch({
      type: 'collection/fetch',
      payload: {
        count: 5,
        token: authToken,
      },
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  // handleAdd = (fields) => {
  //   console.log(fields);
  // };

  render() {
    const { loading } = this.props;
    const { modalVisible } = this.state;

    const { collections } = keysToCamelCase(this.props.collection);
    // console.log(this.props);

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">Toutes</RadioButton>
          <RadioButton disabled value="progress">
            Publiques
          </RadioButton>
          <RadioButton disabled value="waiting">
            Privées
          </RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="Rechercher une entrée"
          onSearch={() => ({})}
        />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({ data: { category, updatedAt, percent = 10, isPublished } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <p>{category}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>Mise à jour le</span>
          <p>{moment(updatedAt).format('DD-MM-YYYY')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress
            percent={percent}
            status={isPublished ? 'active' : 'exception'}
            strokeWidth={6}
            style={{ width: 180 }}
          />
        </div>
      </div>
    );

    const SubMenu = ({ itemId }) => (
      <Menu>
        <Menu.Item>
          <Link to={`/c/${itemId}/edit`}>Éditer la liste</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/c/${itemId}/specimens`}>Gérer les plante</Link>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = ({ itemId }) => (
      <Dropdown overlay={<SubMenu itemId={itemId} />}>
        <a>
          Actions <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="Gestion des listes"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.handleModalVisible(true)}
            >
              Ajouter une entrée
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={collections}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Link to={`/c/${item.uuid}/preview`}>Voir</Link>,
                    <MoreBtn itemId={item.uuid} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={10000} overflowCount={item.specimensCount}>
                        <Avatar src={item.imageThumb} shape="square" size="large" />
                      </Badge>
                    }
                    title={
                      <Link to={`/c/${item.uuid}`} style={{ marginLeft: '24px' }}>
                        {item.title}
                      </Link>
                    }
                    description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
