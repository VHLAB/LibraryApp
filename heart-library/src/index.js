import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Current from './Current';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

// ReactDOM.render(<Intro />, document.getElementById('root'));



(function(Current, render) {
	render(<Current />, document.getElementById('root'));
	registerServiceWorker();
})(Current, ReactDOM.render);