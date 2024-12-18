import { Detector } from "react-detect-offline";
import { FaWifi } from "react-icons/fa6";

function CheckConnection(props) {
  return (
    <Detector
      render={({ online }) =>
        online ? (
          props.children
        ) : (
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
              <FaWifi size={150}/>
              <h1>Connection Error</h1>
              <p>Please check your internet connection and try again.</p>
            </div>
          </div>
        )
      }
    />
  );
}

export default CheckConnection;
