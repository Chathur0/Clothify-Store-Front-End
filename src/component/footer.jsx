import {
  FaFacebook,
  FaGoogle,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import logo from "/logo.png";
import { Link } from "react-router-dom";
import style from "./footer.module.css"

function Footer() {
  return (
    <>
      <div className="bg-light">
        <div className="container pt-5">
          <footer className="">
            <div className="row">
              <div className="col-12 col-md-3 mb-3">
                <img src={logo} alt="" className="w-100" />
              </div>
              <div className="col-12 col-sm-6 col-md-2 mb-3 ps-md-5">
                <h5>Section</h5>
                <ul className="nav flex-column">
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-body-secondary">
                      Home
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-body-secondary">
                      Men
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-body-secondary">
                      Women
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-body-secondary">
                      Kids
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-body-secondary">
                      Baby
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-body-secondary">
                      About
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-12 col-sm-6 col-md-3 mb-3">
                <h5>Social Media</h5>
                <div className="d-flex gap-4">
                  <FaFacebook size={25} cursor={"pointer"}/>
                  <FaGoogle size={25} cursor={"pointer"}/>
                  <FaWhatsapp size={25} cursor={"pointer"}/>
                  <FaYoutube size={25} cursor={"pointer"}/>
                  <FaTiktok size={25} cursor={"pointer"}/>
                </div>
              </div>

              <div className="col-12 col-md-4 mb-3">
                <form>
                  <h5>Subscribe to our newsletter</h5>
                  <p>Monthly digest of what's new and exciting from us.</p>
                  <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                    <label htmlFor="newsletter1" className="visually-hidden">
                      Email address
                    </label>
                    <input
                      id="newsletter1"
                      type="text"
                      className="form-control"
                      placeholder="Email address"
                    />
                    <button className="btn btn-primary" type="button">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
              <p>&copy; 2024 Clothify Store, Inc. All rights reserved.</p>
              <div className="d-flex gap-2">
              <Link to={"/privacy-policy"} className={style.textHover}>Privacy Policy</Link>
              <Link to={"/terms-of-service"} className={style.textHover}>Terms Of Service</Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
export default Footer;
