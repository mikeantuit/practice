import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'

class Sidebar extends Component {

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }

  render() {
    return (

      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            <li className="nav-title text-center">
              <span>Dashboard</span>
            </li>
            <li className="nav-item">
              <NavLink to={'/dashboard'} className="nav-link" activeClassName="active"><i className="icon-speedometer"></i> Dashboard <span className="badge badge-info">NEW</span></NavLink>
            </li>
            <li className="nav-title text-center">
              <span>UI Elements</span>
            </li>
            <li className={this.activeRoute("/components")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Components</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/components/buttons'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Buttons</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/social-buttons'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Social Buttons</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/cards'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Cards</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/modals'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Modals</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/switches'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Switches</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/tables'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tables</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/tabs'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tabs</NavLink>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute("/forms")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-note"></i> Forms</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/forms/basic-forms'} className="nav-link" activeClassName="active"><i className="icon-note"></i> Basic Forms</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/forms/advanced-forms'} className="nav-link" activeClassName="active"><i className="icon-note"></i> Advanced Forms</NavLink>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute("/icons")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Icons</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/icons/font-awesome'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Font Awesome</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/icons/glyphicons'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Glyphicons</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/icons/glyphicons-filetypes'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Glyphicons Filetypes</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/icons/glyphicons-social'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Glyphicons Social</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/icons/simple-line-icons'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Simple Line Icons</NavLink>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute("/plugins")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-energy"></i> Plugins</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/plugins/loading-buttons'} className="nav-link" activeClassName="active"><i className="icon-cursor"></i> Loading Buttons</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/plugins/spinners'} className="nav-link" activeClassName="active"><i className="fa fa-spinner"></i> Spinners</NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink to={'/widgets'} className="nav-link" activeClassName="active"><i className="icon-calculator"></i> Widgets <span className="badge badge-info">NEW</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={'/charts'} className="nav-link" activeClassName="active"><i className="icon-pie-chart"></i> Charts</NavLink>
            </li>
            <li className="divider"></li>
            <li className="nav-title text-center">
              <span>Extras</span>
            </li>
            <li className="nav-item nav-dropdown">
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Pages</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/login'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/register'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Register</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/404'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 404</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/500'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 500</NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default Sidebar;
