import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Form, Card, Select, List, Input, Button, Icon } from 'antd';
import { InstantSearch } from 'react-instantsearch/dom';
import { connectSearchBox, connectHits, connectStateResults } from 'react-instantsearch/connectors';
import truncate from 'lodash/truncate';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardFormRow from '../../components/StandardFormRow';
import TagSelect from '../../components/TagSelect';

import styles from './Phototheque.less';

const { Option } = Select;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */
@Form.create()
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class CoverCardList extends PureComponent {
  componentDidMount() {}

  fetchMore = () => {
    // console.log('fetchMore() unplugged...');
  };

  handleFormSubmit = () => {
    // const { form, dispatch } = this.props;
    // console.log('handleFormSubmit() unplugged...');
  };

  render() {
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;
    // console.log(this.props);

    // SearchBox connector
    const SearchBox = ({ currentRefinement, refine }) => (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="Rechercher parmi les images"
          enterButton="Lancer"
          size="large"
          value={currentRefinement}
          onChange={e => refine(e.target.value)}
          onSearch={this.handleFormSubmit}
          style={{ width: 522 }}
        />
      </div>
    );
    const ConnectedMainSearch = connectSearchBox(SearchBox);

    // Hits connector
    const Hits = ({ hits }) => {
      // console.log(hits);
      return hits ? (
        <List
          rowKey="id"
          loading={loading}
          loadMore={<LoadMoreButton />}
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
                    <Link to={`/i/${item.id}`}>
                      {truncate(item.name, {
                        length: 20,
                      })}
                    </Link>
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

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const LoadMoreButton = connectStateResults(
      ({ searchResults }) =>
        (searchResults && searchResults.nbHits !== 0 ? (
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
        ) : null)
    );

    return (
      <InstantSearch
        indexName="vegebaseIllustrations_ADMIN"
        appId={`${process.env.ALGOLIA_APP_ID}`}
        apiKey={`${process.env.ALGOLIA_SEARCH_KEY}`}
      >
        <PageHeaderLayout content={<ConnectedMainSearch />}>
          <div className={styles.coverCardList}>
            <Card bordered={false}>
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
          </div>
        </PageHeaderLayout>
      </InstantSearch>
    );
  }
}
