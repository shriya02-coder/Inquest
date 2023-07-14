import {BrowserRouter as Router, Route,Switch, Redirect} from 'react-router-dom';
import './App.css';
import React, {useEffect} from 'react';
import Home from './components/Home/Home';
import Dashboard from './components/Workspace/Dashboard/Dashboard';
import Workspace from './components/Workspace/Workspace';
import ScrollToTop from './components/partials/ScrollToTop/ScrollToTop';
import { useDispatch, useSelector } from 'react-redux';
import { AUTOLOGIN, selectUserData } from './reduxSlices/authSlice';
import Reminders from './components/partials/Header/MobileReminder'
import CircularProgress from '@material-ui/core/CircularProgress';
import WritePaper from './components/Workspace/WritePaper/WritePaper';
import Annotate from './components/Workspace/Dashboard/Annotate';

const App = () => {
  const userData = useSelector(selectUserData);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(AUTOLOGIN());
  }, []);

  return (
    <div className="app">
      <ScrollToTop>
        <Router>
          {
            userData.loading ? (
              <div className="col-12 d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
                <CircularProgress size={80} className="display-block"/>
              </div>
            ) : userData.token ? (
              <Switch>
                <Route path='/' component={Home} exact/>
                <Route path='/workspace' component={Dashboard} exact/>
                <Route path='/workspace/reminders' component={Reminders}/>
                <Route path='/workspace/:id' component={Workspace} exact/>
                <Route path='/workspace/:id/:tab' component={Workspace} exact/>
                <Route path='/workspace/:id/drafts/:draftId' component={WritePaper} exact/>
                <Route path='/workspace/:id/drafts/:draftId/:tab' component={WritePaper} exact/>
                <Route path='/annotate' component={Annotate} exact/>
                <Redirect to ="/" />
              </Switch> 
            ) : (
              <Switch>
                <Route path='/' component={Home} exact/>
                <Redirect to ="/" />
              </Switch>
            )
          }
        </Router>
      </ScrollToTop>
    </div>
  )
} 

export default App