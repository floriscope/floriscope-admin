import { Avatar, Button, Card, Dropdown, Icon, Input, List, Menu, Progress, Radio } from 'antd';
import React, { PureComponent } from 'react';
import { Route, Switch } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Liste from './Liste.js';
import styles from './ListeAll.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ collection, loading }) => ({
  collection,
  loading: loading.models.collection,
}))
export default class ListeAll extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'collection/fetch',
      payload: {
        count: 5,
        token:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZ2FldGFuQHZlZ2ViYXNlLmlvIiwiZXhwIjoxNTE2OTEzOTg4fQ.rr7wKPJyn_WO0YR-j4CVQrJfcsUi9cEZRK6T9O9KeW0',
      },
    });
  }

  render() {
    const { collection: { collections }, loading } = this.props;
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

    const ListContent = ({ data: { owner, createdAt, percent, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>Contact</span>
          <p>{owner}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>Créée le</span>
          <p>{moment(createdAt).format('YYYY-MM-DD hh:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
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
        <Switch>
          <Route path="/collection/:slug" component={Liste} />
        </Switch>
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
                <List.Item actions={[<a>Voir</a>, <MoreBtn />]}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a href={item.href}>{item.title}</a>}
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
