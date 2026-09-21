import React, { useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminLogin.css";

function AdminLogin({
  onBack,
  onLoginSuccess,
}) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      setError("");


      /* ===============================
         ADMIN LOGIN API CALL
      =============================== */

      const response =
        await fetch(
          `${API_BASE_URL}/api/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
              role: "admin",
            }),
          }
        );


      let data;


      try {

        data =
          await response.json();

      } catch {

        throw new Error(
          "Server returned an invalid response"
        );

      }


      console.log(
        "Admin login response:",
        data
      );


      /* ===============================
         HANDLE LOGIN ERROR
      =============================== */

      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Admin login failed"
        );

      }


      /* ===============================
         CHECK ADMIN ROLE
      =============================== */

      if (
        data.user?.role !== "admin"
      ) {

        throw new Error(
          "Access denied. Admin account required."
        );

      }


      /* ===============================
         CHECK TOKEN
      =============================== */

      if (!data.token) {

        throw new Error(
          "Authentication token was not received."
        );

      }


      /* ===============================
         CLEAR OLD ADMIN DATA
      =============================== */

      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "adminUser"
      );


      /* ===============================
         SAVE ADMIN TOKEN
         
         IMPORTANT:
         Do NOT use "token" here.
         Merchant and customer may use it.
      =============================== */

      localStorage.setItem(
        "adminToken",
        data.token
      );


      /* ===============================
         SAVE ADMIN USER
      =============================== */

      localStorage.setItem(
        "adminUser",
        JSON.stringify(data.user)
      );


      console.log(
        "Admin token saved:",
        !!localStorage.getItem(
          "adminToken"
        )
      );


      console.log(
        "Admin user:",
        data.user
      );


      /* ===============================
         LOGIN SUCCESS
      =============================== */

      onLoginSuccess({
  ...data.user,
  token: data.token,
});;


    } catch (error) {

      console.error(
        "Admin login error:",
        error
      );


      setError(
        error.message ||
        "Unable to login"
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <section className="admin-login-page">

      <div className="admin-login-card">


        {/* BACK BUTTON */}

        <button
          type="button"
          className="admin-login-back"
          onClick={onBack}
        >

          ← Back

        </button>



        {/* HEADING */}

        <div className="admin-login-heading">

          <div className="admin-login-icon">

            🛡️

          </div>


          <p>

            SHOP EASE

          </p>


          <h1>

            Admin Portal

          </h1>


          <span>

            Sign in to manage your platform

          </span>

        </div>



        {/* ERROR */}

        {error && (

          <div className="admin-login-error">

            {error}

          </div>

        )}



        {/* LOGIN FORM */}

        <form
          onSubmit={handleSubmit}
        >


          {/* EMAIL */}

          <label>

            Admin Email

          </label>


          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="Enter admin email"
            required
          />



          {/* PASSWORD */}

          <label>

            Password

          </label>


          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            placeholder="Enter password"
            required
          />



          {/* SUBMIT */}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >

            {
              loading
                ? "Signing in..."
                : "Sign In as Admin"
            }

          </button>


        </form>


      </div>

    </section>

  );

}


export default AdminLogin;