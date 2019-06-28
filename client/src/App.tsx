import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import './App.css';
import HomeContainer from 'containers/HomeContainer';
import TodoContainer from 'containers/TodoContainer';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <h1><Link to="/">Re:Mind</Link></h1>
        <Switch>
          <Route exact path="/" component={HomeContainer} />
          <Route exact path="/detail" component={TodoContainer} />
          <Route exact path="/detail/:id" component={TodoContainer} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
