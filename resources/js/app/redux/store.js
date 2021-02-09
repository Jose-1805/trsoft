import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import app from './app/reducer';
import tableJl1805 from './tableJL1805/reducer';
import fullLoader from './fullLoader/reducer';
import notifications from './notifications/reducer';

export default createStore(combineReducers({
	app,
	tableJl1805,
	fullLoader,
	notifications
}), applyMiddleware(thunk));
