import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from './components/shared/Spinner';

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));

const Buttons = lazy(() => import('./components/basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./components/basic-ui/Dropdowns'));
const Typography = lazy(() => import('./components/basic-ui/Typography'));

const BasicElements = lazy(() => import('./form-elements/BasicElements'));

const BasicTable = lazy(() => import('./components/tables/BasicTable'));

const Mdi = lazy(() => import('./icons/Mdi'));

const ChartJs = lazy(() => import('./components/charts/ChartJs'));

const Error404 = lazy(() => import('./components/error-pages/Error404'));
const Error500 = lazy(() => import('./components/error-pages/Error500'));

const Login = lazy(() => import('./components/user-pages/Login'));
const Register1 = lazy(() => import('./components/user-pages/Register'));

const Users = lazy(() => import('./components/users/Users'));
const CreateUser = lazy(() => import('./components/users/CreateUser'));

const AdminUsers = lazy(() => import('./components/users/AdminUsers'));
const CreateAdminUser = lazy(() => import('./components/users/CreateAdminUser'));

const UserSubscriptionList = lazy(() => import('./components/users/UserSubscriptionList'));
const CreateUserSubscription = lazy(() => import('./components/users/CreateUserSubscription'));


const CreateSubscription = lazy(() => import('./components/subscription/CreateSubscription'));
const SubscriptionList = lazy(() => import('./components/subscription/SubscriptionList'));
const EditSubscription = lazy(() => import('./components/subscription/EditSubscription'));

const LoginTracker = lazy(() => import('./components/activitylog/LoginTracker'));
const QueryTracker = lazy(() => import('./components/activitylog/QueryTracker'));
const DownloadTracker = lazy(() => import('./components/activitylog/DownloadTracker'));


const Countries = lazy(() => import('./components/countries/Countries'));
const CreateCountry = lazy(() => import('./components/countries/CreateCountry'));

const Contacts = lazy(() => import('./components/contacts/Contacts'));
const SiteSetting = lazy(() => import('./components/sitesetting/SiteSetting'));

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => isAuthenticated() ? (
      <Component {...props} />
  ) : (
      <Redirect to={
          {
              pathname: '/',
              state: {
                  form: props.location
              }
          }} />
  )} />
)

const isAuthenticated = () => {
  const userToken = sessionStorage.getItem("user");
  return userToken;

}

const AppRoutes = () => {
    return (
      <Suspense fallback={<Spinner/>}>
          <Switch>
           
            {/* <Route path="/basic-ui/buttons" component={ Buttons } />
            <Route path="/basic-ui/dropdowns" component={ Dropdowns } />
            <Route path="/basic-ui/typography" component={ Typography } />
            <Route path="/form-Elements/basic-elements" component={ BasicElements } />
            <Route path="/tables/basic-table" component={ BasicTable } />
            <Route path="/icons/mdi" component={ Mdi } />
            <Route path="/charts/chart-js" component={ ChartJs } />
            <Route path="/error-pages/error-404" component={ Error404 } />
            <Route path="/error-pages/error-500" component={ Error500 } />
            <Route path="/user-pages/register-1" component={ Register1 } />            
            <Redirect to="/user-pages/login-1" />*/}

            <Route exact path={`/`} component={Login} />
            {/* <Route path="/login" component={ Login } /> */}
            <Route path="/error-404" component={ Error404 } />

            <PrivateRoute path="/dashboard" component={ Dashboard } />
            <PrivateRoute path="/subscription/createSubscription" component={ CreateSubscription } />
            <PrivateRoute path="/subscription/subscriptionList" component={ SubscriptionList } />
            <PrivateRoute path="/subscription/editsubscription/:id" component={ EditSubscription } />

            <PrivateRoute path="/users/createUser" component={ CreateUser } />
            <PrivateRoute path="/users/userList" component={ Users } />
            <PrivateRoute path="/users/userSubscriptionList/:id/:name" component={ UserSubscriptionList } />
            <PrivateRoute path="/users/createUserSubscription" component={ CreateUserSubscription } />
            
            <PrivateRoute path="/adminUsers/createAdminUser" component={ CreateAdminUser } />
            <PrivateRoute path="/adminUsers/adminUserList" component={ AdminUsers } />
            <PrivateRoute path="/activitylog/loginTracker" component={ LoginTracker } />
            <PrivateRoute path="/activitylog/queryTracker" component={ QueryTracker } />
            <PrivateRoute path="/activitylog/downloadTracker" component={ DownloadTracker } />
            <PrivateRoute path="/countries/createCountry" component={ CreateCountry } />
            <PrivateRoute path="/countries/countryList" component={ Countries } />
            <PrivateRoute path="/contacts/contactList" component={ Contacts } />
            <PrivateRoute path="/sitesetting/siteSetting" component={ SiteSetting } />
            <Redirect from="*" to="/error-404" />
          </Switch>
      </Suspense>
    );
  }


export default AppRoutes;