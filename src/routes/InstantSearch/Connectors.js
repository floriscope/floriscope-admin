import React, { PureComponent, Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Form, Card, Select, List, Input, Button, Icon } from 'antd';
import { InstantSearch } from 'react-instantsearch/dom';
import { connectSearchBox, connectHits } from 'react-instantsearch/connectors';
import truncate from 'lodash/truncate';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardFormRow from '../../components/StandardFormRow';
import TagSelect from '../../components/TagSelect';
import AvatarList from '../../components/AvatarList';

import styles from './Connectors.less';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 8;

/* eslint react/no-array-index-key: 0 */
@Form.create()
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class CoverCardList extends PureComponent {
  componentDidMount() {
    this.fetchMore();
  }

  fetchMore = () => {
    this.props.dispatch({
      type: 'list/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };

  handleFormSubmit = () => {
    const { form, dispatch } = this.props;
    // setTimeout
    setTimeout(() => {
      form.validateFields((err) => {
        if (!err) {
          // eslint-disable-next-line
          dispatch({
            type: 'list/appendFetch',
            payload: {
              count: 8,
            },
          });
        }
      });
    }, 0);
  };

  render() {
    const { list: { list }, loading, form } = this.props;
    const { getFieldDecorator } = form;

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="Rechercher parmi les images"
          enterButton="Lancer"
          size="large"
          onSearch={this.handleFormSubmit}
          style={{ width: 522 }}
        />
      </div>
    );
    const SearchBox = ({ currentRefinement, refine }) => (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="Rechercher parmi les images"
          enterButton="Lancer"
          size="large"
          value={currentRefinement}
          onChange={e => refine(e.target.value)}
          style={{ width: 522 }}
        />
      </div>
    );
    const ConnectedMainSearch = connectSearchBox(SearchBox);

    const Hits = ({ hits }) => {
      // console.log(hits);
      return hits ? (
        <List
          rowKey="id"
          loading={loading}
          loadMore={loadMore}
          grid={{ gutter: 24, lg: 4, md: 3, sm: 2, xs: 1 }}
          dataSource={hits}
          renderItem={item => (
            <List.Item>
              <Card
                className={styles.card}
                hoverable
                key={item.id}
                cover={
                  <img
                    alt={item.title}
                    src={item.picture.medium.url}
                    height={154}
                    style={{ objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title={
                    <a href="#">
                      {truncate(item.name, {
                        length: 20,
                      })}
                    </a>
                  }
                  description={item.rights}
                />
                <div className={styles.cardItemContent}>
                  <span>{moment(item.updatedAt).fromNow()}</span>
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <div>Aucun résultat</div>
      );
    };
    const ConnectedHits = connectHits(Hits);

    const cardList = list ? (
      <List
        rowKey="id"
        loading={loading}
        loadMore={loadMore}
        grid={{ gutter: 24, lg: 4, md: 3, sm: 2, xs: 1 }}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={<img alt={item.title} src={item.cover} height={154} />}
            >
              <Card.Meta title={<a href="#">{item.title}</a>} description={item.subDescription} />
              <div className={styles.cardItemContent}>
                <span>{moment(item.updatedAt).fromNow()}</span>
                <div className={styles.avatarList}>
                  <AvatarList size="mini">
                    {item.members.map((member, i) => (
                      <AvatarList.Item
                        key={`${item.id}-avatar-${i}`}
                        src={member.avatar}
                        tips={member.name}
                      />
                    ))}
                  </AvatarList>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    ) : null;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const loadMore =
      list.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
              <span>
                <Icon type="loading" /> Chargement...
              </span>
            ) : (
              'Plus de résultats'
            )}
          </Button>
        </div>
      ) : null;

    return (
      <InstantSearch
        indexName="vegebaseIllustrations_ADMIN"
        appId={`${process.env.ALGOLIA_APP_ID}`}
        apiKey={`${process.env.ALGOLIA_SEARCH_KEY}`}
      >
        <PageHeaderLayout content={mainSearch}>
          <div className={styles.coverCardList}>
            <Card bordered={false}>
              <ConnectedMainSearch />
              <Form layout="inline">
                <StandardFormRow title="Mots-Clés" block style={{ paddingBottom: 11 }}>
                  <FormItem>
                    {getFieldDecorator('category')(
                      <TagSelect onChange={this.handleFormSubmit} expandable>
                        <TagSelect.Option value="cat1">feuilles</TagSelect.Option>
                        <TagSelect.Option value="cat2">fruits</TagSelect.Option>
                        <TagSelect.Option value="cat3">écorce</TagSelect.Option>
                        <TagSelect.Option value="cat4">printemps</TagSelect.Option>
                        <TagSelect.Option value="cat5">automne</TagSelect.Option>
                        <TagSelect.Option value="cat6">hiver</TagSelect.Option>
                        <TagSelect.Option value="cat7">port libre</TagSelect.Option>
                        <TagSelect.Option value="cat8">bourgeons</TagSelect.Option>
                        <TagSelect.Option value="cat9">macro</TagSelect.Option>
                        <TagSelect.Option value="cat10">rouge</TagSelect.Option>
                        <TagSelect.Option value="cat11">blanc</TagSelect.Option>
                        <TagSelect.Option value="cat12">bleu</TagSelect.Option>
                      </TagSelect>
                    )}
                  </FormItem>
                </StandardFormRow>
                <StandardFormRow title="Autres filtres" grid last>
                  <Row gutter={16}>
                    <Col lg={8} md={10} sm={10} xs={24}>
                      <FormItem {...formItemLayout} label="Auteur">
                        {getFieldDecorator('author', {})(
                          <Select
                            onChange={this.handleFormSubmit}
                            placeholder="Auteur"
                            style={{ maxWidth: 200, width: '100%' }}
                          >
                            <Option value="jac-boutaud">Jac BOUTAUD</Option>
                            <Option value="james-garnett">James Garnett</Option>
                            <Option value="daniel-lejeune">Daniel LEJEUNE</Option>
                            <Option value="lepage-vivaces">Lepage Vivaces</Option>
                            <Option value="guillot-bourne">Guillot Bourne II</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col lg={8} md={10} sm={10} xs={24}>
                      <FormItem {...formItemLayout} label="Statut">
                        {getFieldDecorator('rate', {})(
                          <Select
                            onChange={this.handleFormSubmit}
                            placeholder="Statut"
                            style={{ maxWidth: 200, width: '100%' }}
                          >
                            <Option value="good">Publiées</Option>
                            <Option value="normal">Non publiées</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </StandardFormRow>
              </Form>
            </Card>
            <div className={styles.cardList}>
              <ConnectedHits />
            </div>
            <div className={styles.cardList}>{cardList}</div>
            <div>{loadMore}</div>
          </div>
        </PageHeaderLayout>
      </InstantSearch>
    );
  }
}
