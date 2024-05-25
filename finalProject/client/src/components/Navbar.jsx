import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            <span className="ms-2">Dorm Finder</span> 
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample">
                  <i className="fa-solid fa-bars"></i>
                </a>
              </li>
            </ul>
            <span className="navbar-text">
              Sign Out
            </span>
          </div>
        </div>
      </nav>

      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">Dormitory Management System</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0">
          <div className="list-group list-group-flush">
            <Link to="/" className="list-group-item list-group-item-action bg-light">
              <i className="fa-solid fa-home me-2"></i> Dashboard
            </Link>
            <Link to="/rooms" className="list-group-item list-group-item-action bg-light">
              <i className="fa-solid fa-door-open me-2"></i> Rooms
            </Link>
            <Link to="/tenants" className="list-group-item list-group-item-action bg-light">
              <i className="fa-solid fa-users me-2"></i> Tenants
            </Link>
            <Link to="/bookings" className="list-group-item list-group-item-action bg-light">
              <i className="fa-solid fa-calendar-check me-2"></i> Bookings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
