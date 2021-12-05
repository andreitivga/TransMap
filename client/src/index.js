import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './Router';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);

