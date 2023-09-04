import {createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import authReducer from '../reducers/authReducer';
import postsReducer from '../reducers/postsReducer';
import homeReducer from '../reducers/homeReducer';

const configureStore = createStore(
  combineReducers({authReducer, postsReducer, homeReducer}),
  {},
  composeWithDevTools(),
);

export default configureStore;
