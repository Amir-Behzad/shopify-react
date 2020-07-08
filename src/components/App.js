import React from 'react';
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import HomePage from '../pages/HomePage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ProductPage from '../pages/ProductPage';
import ShopProvider from '../context/shopContext'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'

const debug =
  process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();

const engine = new Styletron();

function App() {

  return (
    <ShopProvider>
      <StyletronProvider value={engine} debug={debug} debugAfterHydration>
        <Router>
          <Navbar />
          <Cart />
          <Switch>
            <Route path="/product/:id">
              <ProductPage />
            </Route>
            <Route path="/" exact>
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </StyletronProvider>
    </ShopProvider>
  );
}

export default App;
