import React from 'react';
import ReactDOM from 'react-dom';
// import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
// import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import routers from './router';
import renderRoutes from './router/renderRoutes';
import { SocketContext, socket } from './hook/socket';

import './index.less';

function App() {
  return <Router>{renderRoutes(routers)}</Router>;
}

// const host = import.meta.env.MODE === 'development' ? 'http://localhost:9000' : window.location.origin;

// const client = new ApolloClient({
//   uri: `${host}/graphql`,
//   cache: new InMemoryCache()
// });

ReactDOM.render(
  <SocketContext.Provider value={{ socket }}>
    <App />
  </SocketContext.Provider>,
  document.getElementById('root')
);

// ReactDOM.render(
//   <ApolloProvider client={client}>
//     <App />
//   </ApolloProvider>,
//   document.getElementById('root')
// );
