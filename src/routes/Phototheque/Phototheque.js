import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Form,
  Card,
  Select,
  List,
  Input,
  Button,
  Tooltip,
  Icon,
  Switch,
} from 'antd';
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
                actions={[
                  <Tooltip title="Prévisualiser">
                    <Icon type="eye" />
                  </Tooltip>,
                  <Tooltip title="Éditer">
                    <Icon type="edit" />
                  </Tooltip>,
                  <Tooltip title="Publier">
                    <Switch />
                  </Tooltip>,
                ]}
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

    const tagOptions = [
      { key: 'cat1', value: 'feuilles' },
      { key: 'cat2', value: 'fruits' },
      { key: 'cat3', value: 'écorce' },
      { key: 'cat4', value: 'printemps' },
      { key: 'cat5', value: 'automne' },
      { key: 'cat6', value: 'hiver' },
      { key: 'cat7', value: 'port libre' },
      { key: 'cat8', value: 'bourgeons' },
      { key: 'cat9', value: 'macro' },
      { key: 'cat10', value: 'rouge' },
      { key: 'cat11', value: 'blanc' },
      { key: 'cat12', value: 'bleu' },
    ];

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
                        {tagOptions.map((option, i) => (
                          <TagSelect.Option key={i} value={option.key}>
                            {option.value}
                          </TagSelect.Option>
                        ))}
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
