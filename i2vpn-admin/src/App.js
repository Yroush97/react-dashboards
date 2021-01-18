import React, { Suspense, useEffect } from 'react';
import { HashRouter, HashRouter as Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./store/actions/index";
import Spinner from './components/Spinner/Spinner';
import Sidebare from './components/Sidebar/Sidebar';
const App = (props) => {

   useEffect(() => {
      props.onTryAutoSignin();
      // props.onHomeState();
   }, []);

   //#region lazy load component
      const Home = React.lazy(() => {
         return import("./pages/Home/Home");
      });
      const Auth = React.lazy(() => {
         return import("./pages/Auth/Login/Login");
      });
      const Servers = React.lazy(() => {
         return import("./pages/Servers/Servers");
      });
      const Users = React.lazy(() => {
         return import("./pages/Users/Users");
      });
      const Countries = React.lazy(() => {
         return import("./pages/Countries/Countries");
      });
      const Logs = React.lazy(() => {
         return import("./pages/LogsPage/LogsPage");
      });
      const OperatingSystems = React.lazy(()=>{
         return import("./pages/OperatingSystems/OperatingSystems");
      })
      const Notifications = React.lazy(() => {
         return import("./pages/Notifications/Notifications");
      });
      const Devices = React.lazy(() => {
         return import("./pages/Devices/Devices");
      });
      const Settings = React.lazy(() => {
         return import("./pages/Settings/Settings");
      });
      const Sessions = React.lazy(() => {
         return import("./pages/Sessions/Sessions");
      });
      const Feedbacks = React.lazy(() => {
         return import("./pages/Feedbacks/Feedbacks");
      });
      const Logout = React.lazy(() => {
         return import("./pages/Auth/Logout/Logout");
      });
   //#endregion
  
   //#region routes
      let routes = (
         <Switch>
            <Route path="/" render={() => <Auth />} />
         </Switch>
      );
      if (props.isAuthenticated) {
         routes = (
            <Sidebare items={
               <Switch>
                  <Route exact path="/" render={() => <Home />} />
                  <Route path="/countries" render={() => <Countries />} />
                  <Route path="/servers" render={() => <Servers />} />
                  <Route path="/users" render={() => <Users />} />
                  <Route path="/logs" render={() => <Logs />} />
                  <Route path="/operatingsystems" render={()=><OperatingSystems />} />
                  <Route path="/sessions" render={() => <Sessions />} />
                  <Route path="/devices" render={() => <Devices />} />
                  <Route path="/notifications" render={() => <Notifications />} />
                  <Route path="/feedbacks" render={() => <Feedbacks />} />
                  <Route path="/settings" render={() => <Settings />} />
                  <Route path='/logout' render={() => <Logout />} />
               </Switch>
            } /> 
         );
      }
   //#endregion
  
   return (
      <HashRouter>
         <Suspense fallback={<Spinner />}>{routes} </Suspense>
      </HashRouter>
   );
   
};
const mapStateToProps = (state) => {
   return {
      isAuthenticated: state.auth.token !== null,
      email: state.auth.email,
      // onlineNow: state.home.onlineNow
   };
};
const mapDispatchToProps = (dispatch) => {
   return {
      onTryAutoSignin: () => dispatch(actions.authCheckState()),
      // onHomeState: () => dispatch(actions.homeState()),
   };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
