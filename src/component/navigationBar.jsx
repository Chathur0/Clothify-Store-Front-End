import { Link } from "react-router-dom";
function navigationBar(props) {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <Link to={"Clothify-Store-Front-End/"} className="navbar-brand fw-bolder fs-1">
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
              <Link
                to={"/women-product"}
                className="nav-link fw-bolder"
                aria-current="page"
                href="#"
              >
                Women
              </Link>
              <Link to={"/men-product"} className="nav-link fw-bolder" href="#">
                Men
              </Link>
              <Link
                to={"/baby-product"}
                className="nav-link fw-bolder"
                href="#"
              >
                Baby
              </Link>
              <Link
                to={"/kids-product"}
                className="nav-link fw-bolder"
                href="#"
              >
                Kids
              </Link>
            </div>

            <div className="flex-shrink-0 dropdown">
              {props.isLoggedIn ? (
                <>
                  <a
                    href="#"
                    className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={
                        props.profileImage ||
                        "https://cdn-icons-png.flaticon.com/512/1999/1999625.png"
                      }
                      alt="User"
                      width="32"
                      height="32"
                      className="rounded-circle"
                    />
                  </a>
                  <ul className="dropdown-menu text-small shadow">
                    <li>
                      <Link to={"/profile"} className="dropdown-item" href="#">
                        Profile
                      </Link>
                    </li>
                    {props.userRole === "admin" && (
                      <li>
                        <Link
                          to={"/dashboard"}
                          className="dropdown-item"
                          href="/dashboard"
                        >
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
                          location.reload();
                        }}
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <a
                    href="#"
                    className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1999/1999625.png"
                      alt="Guest"
                      width="32"
                      height="32"
                      className="rounded-circle"
                    />
                  </a>
                  <ul className="dropdown-menu text-small shadow">
                    <li>
                      <Link to={"/login"} className="dropdown-item">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to={"/register"} className="dropdown-item" href="#">
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default navigationBar;
