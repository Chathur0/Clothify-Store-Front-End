import { Link } from "react-router-dom";

function NavigationBar(props) {
  const basePath = "/Clothify-Store-Front-End";

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <Link to={`${basePath}/`} className="navbar-brand fw-bolder fs-1">
            Clothify Store
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
              <Link to={`${basePath}/women-product`} className="nav-link fw-bolder">
                Women
              </Link>
              <Link to={`${basePath}/men-product`} className="nav-link fw-bolder">
                Men
              </Link>
              <Link to={`${basePath}/baby-product`} className="nav-link fw-bolder">
                Baby
              </Link>
              <Link to={`${basePath}/kids-product`} className="nav-link fw-bolder">
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
                      <Link to={`${basePath}/profile`} className="dropdown-item">
                        Profile
                      </Link>
                    </li>
                    {props.userRole === "admin" && (
                      <li>
                        <Link to={`${basePath}/dashboard`} className="dropdown-item">
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
                      <Link to={`${basePath}/login`} className="dropdown-item">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to={`${basePath}/register`} className="dropdown-item">
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
