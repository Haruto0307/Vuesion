import Axios                               from 'axios';
import MockAdapter                         from 'axios-mock-adapter';
import { VuexExampleActions }              from './actions';
import { ActionContext, Commit, Dispatch } from 'vuex';
import { IState }                          from '../mutations';

describe('VuexExampleActions', () => {
  let testContext: ActionContext<IState, IState>;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    testContext = {
      dispatch:    jest.fn() as Dispatch,
      commit:      jest.fn() as Commit,
      state:       {
                     vuexExample: {
                       topics: [],
                       error:  null,
                     },
                   } as IState,
      getters:     {},
      rootState:   {} as IState,
      rootGetters: {},
    };

    mockAxios = new MockAdapter(Axios);
  });

  test('it should call api and commit response', (done) => {
    const data: any[] = [
      { id: 1, name: 'John Smith' },
    ];
    mockAxios.onGet('https://jsonplaceholder.typicode.com/posts')
             .reply(200, data);

    VuexExampleActions.getTopics(testContext)
                      .then(() => {
                        expect(testContext.commit).toHaveBeenCalledTimes(1);
                        expect(testContext.commit).toHaveBeenCalledWith('TOPICS', data);
                        done();
                      });
  });

  test('it should use initial state', (done) => {
    const data: any = { id: 1, name: 'John Smith' };
    testContext.state.vuexExample.topics.push(data);

    VuexExampleActions.getTopics(testContext)
                      .then(() => {
                        expect(testContext.commit).toHaveBeenCalledTimes(1);
                        expect(testContext.commit).toHaveBeenCalledWith('TOPICS', [data]);
                        done();
                      });
  });

  test('it should handle error', (done) => {
    mockAxios.onGet('https://jsonplaceholder.typicode.com/posts')
             .reply(500);

    VuexExampleActions.getTopics(testContext)
                      .then(() => {
                        expect(testContext.commit).toHaveBeenCalledTimes(1);
                        expect(testContext.commit)
                        .toHaveBeenCalledWith('TOPICS_FAILURE', new Error('Request failed with status code 500'));
                        done();
                      });
  });

});
