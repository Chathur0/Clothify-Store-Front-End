import { Link } from "react-router-dom";
import  Button  from "/button.png";

function NavigationBar(props) {

  return (
    <>
      <nav className=" navbar navbar-expand-lg bg-body-tertiary p">
        <div className="container">
          <Link to={`/`} className="navbar-brand fw-bolder fs-1 col-8 col-sm-6 col-md-4 col-lg-3">
            <img src={Button} alt="Home Logo" className="w-100"/>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav mx-auto">
              <Link to={`/women-product`} className="nav-link fw-bolder">
                Women
              </Link>
              <Link to={`/men-product`} className="nav-link fw-bolder">
                Men
              </Link>
              <Link to={`/baby-product`} className="nav-link fw-bolder">
                Baby
              </Link>
              <Link to={`/kids-product`} className="nav-link fw-bolder">
                Kids
              </Link>
            </div>

            <div className="flex-shrink-0 dropdown">
              <a
                href="#"
                className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={
                    props.isLoggedIn
                      ? props.profileImage ||
                        "https://cdn-icons-png.flaticon.com/512/1999/1999625.png"
                      : "https://cdn-icons-png.flaticon.com/512/1999/1999625.png"
                  }
                  alt={props.isLoggedIn ? "User" : "Guest"}
                  width="32"
                  height="32"
                  className="rounded-circle"
                />
              </a>
              <ul className="dropdown-menu text-small shadow">
                {props.isLoggedIn ? (
                  <>
                    <li>
                      <Link to={`/profile`} className="dropdown-item">
                        Profile
                      </Link>
                    </li>
                    {props.userRole === "admin" && (
                      <li>
                        <Link to={`/dashboard`} className="dropdown-item">
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          localStorage.removeItem("jwtToken");
                          window.location.reload();
                        }}
                      >
                        Sign out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to={`/login`} className="dropdown-item">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to={`/register`} className="dropdown-item">
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavigationBar;
