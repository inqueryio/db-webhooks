import React, { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";

import logoD from "../assets/logoD.svg";
import logoW from "../assets/logoW.svg";

import { getAPIBaseURL, healthCheck, httpGet } from "../util/api";

const CheckBEHealth = ({ children }) => {
  const [connectionData, setConnectionData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [render, setRender] = useState(false);

  useEffect(() => {
    setLoading(true);
    healthCheck(
      (data) => {
        setError(null);
        // Check to see if a connection has been set up
        httpGet(
          "connection",
          (data) => {
            setConnectionData(data);
            setLoading(false);
            setRender(true);
          },
          (data) => {
            setLoading(false);
            setRender(true);
          }
        );
      },
      (data) => {
        setError("error");
        setRender(true);
        setLoading(false);
        console.log(data);
      }
    );
  }, [setLoading]);

  if (loading) {
    return (
      <div
        className="container-fluid vw-100 vh-100 align-items-center d-flex justify-content-center"
        style={{
          background: "rgba(0,0,0,0.4)",
          // opacity: 0.4,
        }}
      >
        <LoadingOverlay active={loading} spinner={true} text="Loading..." />
      </div>
    );
  }

  if (error || !render) {
    return (
      <div className="login_form pb-3">
        <div className="container-fluid vw-100 vh-100  align-items-center d-flex justify-content-center flex-column ">
          <div className="logo d-flex justify-content-center pt-4">
            <img className="logoD" src={logoD} alt="" />
            <img className="logoW" src={logoW} alt="" />
          </div>
          <hr />
          <div className="px-4">
            <h4 className="f24 text-center pt-2 fw500">Connection Error</h4>
            <p className="color2 text-center pb-2 f16">
              The frontend was unable to connect to the API server
            </p>
            <ul className="color2 pb-2 f16">
              <li>Ensure the backend is running</li>
              <li>
                Make sure you can connect to the API server directly:{" "}
                <a
                  target="_blank"
                  href={getAPIBaseURL() + "health"}
                  rel="noreferrer"
                >
                  {getAPIBaseURL() + "health"}
                </a>
              </li>
            </ul>
          </div>
          <hr />
          <div className="px-4"></div>
        </div>
      </div>
    );
  } else {
    return children;
  }
};

export default CheckBEHealth;
