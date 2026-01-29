import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse, Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';


class Sidebar extends Component {

  state = {fullName: ""};

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({[menuState] : false});
    } else if(Object.keys(this.state).length === 0) {
      this.setState({[menuState] : true});
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({[i]: false});
      });
      this.setState({[menuState] : true}); 
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }


  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({[i]: false});
    });

    const dropdownPaths = [
      {path:'/apps', state: 'appsMenuOpen'},
      {path:'/basic-ui', state: 'basicUiMenuOpen'},
      {path:'/form-elements', state: 'formElementsMenuOpen'},
      {path:'/tables', state: 'tablesMenuOpen'},
      {path:'/icons', state: 'iconsMenuOpen'},
      {path:'/charts', state: 'chartsMenuOpen'},
      {path:'/user-pages', state: 'userPagesMenuOpen'},
      {path:'/error-pages', state: 'errorPagesMenuOpen'},
      {path:'/users', state: 'userMenuOpen'},
      {path:'/adminUsers', state: 'adminUserMenuOpen'},
      {path:'/subscription', state: 'subscriptionMenuOpen'},
      {path:'/activitylog', state: 'activitylogMenuOpen'},
      {path:'/countries', state: 'countryMenuOpen'},
      {path:'/contacts', state: 'contactMenuOpen'},
      {path:'/sitesetting', state: 'siteSettingMenuOpen'},
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({[obj.state] : true})
      }
    }));
 
  }

  render () {
    
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          {/*<a className="sidebar-brand brand-logo" href="index.html"><img src={require('../../assets/images/logo.png')} alt="logo" /></a>*/}
          <a href="index.html"><img src={require('../../assets/images/logo.png')} alt="logo" /></a>
          <a className="sidebar-brand brand-logo-mini" href="index.html"><img src={require('../../assets/images/logo.png')} alt="logo" /></a>
        </div><br></br><br></br>
        <ul className="nav">
         
          
           <li className={ this.isPathActive('/dashboard') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <Link className="nav-link" to="/dashboard">
              <span className="menu-icon"><i className="mdi mdi-speedometer"></i></span>
              <span className="menu-title"><Trans>Dashboard</Trans></span>
            </Link>
          </li>
          
        
          <li className={ this.isPathActive('/users') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <div className={ this.state.userMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('userMenuOpen') } data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-table-large"></i>
              </span>
              <span className="menu-title"><Trans>Users</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.userMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/users/userList') ? 'nav-link active' : 'nav-link' } to="/users/userList"><Trans>User List</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
            <Collapse in={ this.state.userMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/users/createUser') ? 'nav-link active' : 'nav-link' } to="/users/createUser"><Trans>Add New User</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li className={ this.isPathActive('/adminUsers') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <div className={ this.state.userMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('adminUserMenuOpen') } data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-table-large"></i>
              </span>
              <span className="menu-title"><Trans>Admin Users</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.adminUserMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/adminUsers/adminUserList') ? 'nav-link active' : 'nav-link' } to="/adminUsers/adminUserList"><Trans>Admin User List</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
            <Collapse in={ this.state.adminUserMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/adminUsers/createAdminUser') ? 'nav-link active' : 'nav-link' } to="/adminUsers/createAdminUser"><Trans>Add New Admin User</Trans></Link></li>
                </ul>
              </div>
            </Collapse>            
          </li> 

          <li className={ this.isPathActive('/subscription') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <div className={ this.state.subscriptionMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('subscriptionMenuOpen') } data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-table-large"></i>
              </span>
              <span className="menu-title"><Trans>Subscriptions</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.subscriptionMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/subscription/subscriptionList') ? 'nav-link active' : 'nav-link' } to="/subscription/subscriptionList"><Trans>Subscription List</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
            <Collapse in={ this.state.subscriptionMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/subscription/createSubscription') ? 'nav-link active' : 'nav-link' } to="/subscription/createSubscription"><Trans>Add New Subscription</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
            <Collapse in={ this.state.subscriptionMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/subscription/editSubscription') ? 'nav-link active' : 'nav-link' } to="/subscription/editSubscription"><Trans>Edit Subscription</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li className={ this.isPathActive('/activitylog') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <div className={ this.state.activitylogMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('activitylogMenuOpen') } data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-table-large"></i>
              </span>
              <span className="menu-title"><Trans>Activity Log</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.activitylogMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/activitylog/loginTracker') ? 'nav-link active' : 'nav-link' } to="/activitylog/loginTracker"><Trans>Login Tracker</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
            <Collapse in={ this.state.activitylogMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/activitylog/queryTracker') ? 'nav-link active' : 'nav-link' } to="/activitylog/queryTracker"><Trans>Query Tracker</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
            <Collapse in={ this.state.activitylogMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/activitylog/downloadTracker') ? 'nav-link active' : 'nav-link' } to="/activitylog/downloadTracker"><Trans>Download Tracker</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li className={ this.isPathActive('/countries') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <div className={ this.state.countryMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('countryMenuOpen') } data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-table-large"></i>
              </span>
              <span className="menu-title"><Trans>Countries</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.countryMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/countries/countryList') ? 'nav-link active' : 'nav-link' } to="/countries/countryList"><Trans>Country List</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
            <Collapse in={ this.state.countryMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/countries/createCountry') ? 'nav-link active' : 'nav-link' } to="/countries/createCountry"><Trans>Add New Country</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li className={ this.isPathActive('/contacts') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <div className={ this.state.contactMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('contactMenuOpen') } data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-table-large"></i>
              </span>
              <span className="menu-title"><Trans>Contacts</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.contactMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/contacts/contactList') ? 'nav-link active' : 'nav-link' } to="/contacts/contactList"><Trans>Contact List</Trans></Link></li>
                </ul>
              </div>
            </Collapse>            
          </li>

             <li className={ this.isPathActive('/sitesetting') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <div className={ this.state.siteSettingMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('siteSettingMenuOpen') } data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-table-large"></i>
              </span>
              <span className="menu-title"><Trans>Site Setting</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.siteSettingMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/sitesetting/siteSetting') ? 'nav-link active' : 'nav-link' } to="/sitesetting/siteSetting"><Trans>Site Setting</Trans></Link></li>
                </ul>
              </div>
            </Collapse>            
          </li>
         
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
      
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);