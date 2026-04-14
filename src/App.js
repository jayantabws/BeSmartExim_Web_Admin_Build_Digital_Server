import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './components/shared/Navbar';
import Sidebar from './components/shared/Sidebar';
import Footer from './components/shared/Footer';
import { withTranslation } from "react-i18next";
import { ThemeProvider } from './components/context/ThemeContext';

import AxiosUser from "./components/shared/AxiosUser";
import IdleTimerLogout from './components/IdealLogout/IdleTimerLogout';

class App extends Component {
  constructor(props){
    super(props)
  }
  state = {}

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }


  componentDidMount() {
   // this.onRouteChanged();
  }

    logoutUser = () => {
    let values = sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : {};

    const postData = {
      userId: values.userid,
      loginId: values.loginId,
      sessionId: values.sessionId
    };

    AxiosUser({
      method: "PUT",
      url: `/user-management/logout`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        alert("LogOut Successful");

        sessionStorage.removeItem("userToken");
        sessionStorage.removeItem("userId");

        this.props.history.push("/");
      })
      .catch(() => {
        console.log("Logout error");
      });
  };

  render () {
    let navbarComponent = !this.state.isFullPageLayout ? <Navbar {...this.props}/> : '';
    let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar/> : '';
    let footerComponent = !this.state.isFullPageLayout ? <Footer/> : '';

    return (
      <ThemeProvider >
        <div className="container-scroller">

          {/* {sessionStorage.getItem("userToken") && (
      <IdleTimerLogout onLogout={this.logoutUser} />
    )} */}
    
          { (this.isPathActive('/login') || this.props.location.pathname == '/')  ? null : sidebarComponent }
          <div className="container-fluid page-body-wrapper">
            { (this.isPathActive('/login') || this.props.location.pathname == '/') ? null : navbarComponent } 
            <div className="main-panel">
              <div className="content-wrapper">
                <AppRoutes/>
              
              </div>
              { (this.isPathActive('/login') || this.props.location.pathname == '/') ? null : footerComponent } 
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      // this.onRouteChanged();
    }
  }

  // onRouteChanged() {
  //   console.log("ROUTE CHANGED");
  //   const { i18n } = this.props;
  //   const body = document.querySelector('body');
  //   if(this.props.location.pathname === '/layout/RtlLayout') {
  //     body.classList.add('rtl');
  //     i18n.changeLanguage('ar');
  //   }
  //   else {
  //     body.classList.remove('rtl')
  //     i18n.changeLanguage('en');
  //   }
  //   window.scrollTo(0, 0);
  //   const fullPageLayoutRoutes = ['/user-pages/login-1', '/user-pages/login-2', '/user-pages/register-1', '/user-pages/register-2', '/user-pages/lockscreen', '/error-pages/error-404', '/error-pages/error-500', '/general-pages/landing-page'];
  //   for ( let i = 0; i < fullPageLayoutRoutes.length; i++ ) {
  //     if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
  //       this.setState({
  //         isFullPageLayout: true
  //       })
  //       document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
  //       break;
  //     } else {
  //       this.setState({
  //         isFullPageLayout: false
  //       })
  //       document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
  //     }
  //   }
  // }

}

//export default App;

export default withTranslation()(withRouter(App));
