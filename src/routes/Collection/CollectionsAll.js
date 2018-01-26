import {
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Icon,
  Input,
  List,
  Menu,
  Progress,
  Radio,
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

@connect(({ collection, loading }) => ({
  collection,
  loading: loading.models.collection,
}))
export default class CollectionsAll extends PureComponent {
  componentDidMount() {
    const currentUser = keysToCamelCase(JSON.parse(getCurrentUser()));
    // console.log(keysToCamelCase(currentUser));
    console.log(currentUser);
    const { authToken } = currentUser;
    this.props.dispatch({
      type: 'collection/fetch',
      payload: {
        count: 5,
        token: authToken,
      },
    });
  }

  render() {
    const { loading } = this.props;
    const { collections } = keysToCamelCase(this.props.collection);
    console.log(collections);

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

    const menu = (
      <Menu>
        <Menu.Item>
          <a>Éditer la liste</a>
        </Menu.Item>
        <Menu.Item>
          <a>Gérer les plantes</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
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
            <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
              Ajouter une entrée
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={collections}
              renderItem={item => (
                <List.Item actions={[<Link to={`/c/${item.uuid}`}>Voir</Link>, <MoreBtn />]}>
                  <List.Item.Meta
                    avatar={
                      <Badge count={10000} overflowCount={item.specimens_count}>
                        <Avatar src={item.image_thumb} shape="square" size="large" />
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
      </PageHeaderLayout>
    );
  }
}
