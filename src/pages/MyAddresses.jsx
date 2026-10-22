import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./MyAddresses.css";

function MyAddresses({
  loggedInUser,
  onBack,
}) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);
  const [defaultLoading, setDefaultLoading] =
    useState(null);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =========================================
  // FETCH ADDRESSES
  // =========================================

  const fetchAddresses = async () => {
    if (!loggedInUser?.id) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/addresses/${loggedInUser.id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch addresses"
        );
      }

      // Remove duplicate addresses
      const uniqueAddresses = [];
      const seen = new Set();

      (data.addresses || []).forEach(
        (address) => {
          const key = [
            address.full_name,
            address.phone,
            address.address_line,
            address.city,
            address.state,
            address.pincode,
          ]
            .map((value) =>
              String(value || "")
                .trim()
                .toLowerCase()
            )
            .join("|");

          if (!seen.has(key)) {
            seen.add(key);
            uniqueAddresses.push(address);
          }
        }
      );

      // Default address first
      uniqueAddresses.sort(
        (a, b) =>
          Number(b.is_default) -
          Number(a.is_default)
      );

      setAddresses(uniqueAddresses);
    } catch (err) {
      console.error(
        "My Addresses error:",
        err
      );

      setError(
        "Unable to load saved addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [loggedInUser]);

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // ADD ADDRESS
  // =========================================

  const handleAddAddress = async (
    event
  ) => {
    event.preventDefault();

    if (!loggedInUser?.id) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/api/addresses`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id:
              loggedInUser.id,

            full_name:
              form.full_name.trim(),

            phone:
              form.phone.trim(),

            address_line:
              form.address_line.trim(),

            city:
              form.city.trim(),

            state:
              form.state.trim(),

            pincode:
              form.pincode.trim(),

            // First address becomes default
            is_default:
              addresses.length === 0,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to save address"
        );
      }

      // Clear form
      setForm({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
      });

      await fetchAddresses();

      alert(
        addresses.length === 0
          ? "Address saved as default address."
          : "Address saved successfully."
      );
    } catch (err) {
      console.error(
        "Add address error:",
        err
      );

      alert(
        err.message ||
          "Failed to save address"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // SET DEFAULT
  // =========================================

  const handleSetDefault = async (
    addressId
  ) => {
    if (!loggedInUser?.id) {
      return;
    }

    try {
      setDefaultLoading(addressId);

      const response = await fetch(
        `${API_BASE_URL}/api/addresses/${addressId}/default`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id:
              loggedInUser.id,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to set default address"
        );
      }

      await fetchAddresses();
    } catch (err) {
      console.error(
        "Set default address error:",
        err
      );

      alert(
        err.message ||
          "Failed to set default address"
      );
    } finally {
      setDefaultLoading(null);
    }
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (
    addressId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this address?"
      );

    if (!confirmed) {
      return;
    }

    if (!loggedInUser?.id) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/addresses/${addressId}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id:
              loggedInUser.id,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete address"
        );
      }

      await fetchAddresses();
    } catch (err) {
      console.error(
        "Delete address error:",
        err
      );

      alert(
        err.message ||
          "Failed to delete address"
      );
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <section className="my-addresses-page">
        <div className="my-addresses-container">

          <button
            type="button"
            className="my-addresses-back"
            onClick={onBack}
          >
            ← Back to My Profile
          </button>

          <div className="address-loading">
            <div className="address-loading-icon">
              📍
            </div>

            <h2>
              Loading your addresses...
            </h2>

            <p>
              Please wait a moment.
            </p>
          </div>

        </div>
      </section>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <section className="my-addresses-page">

      <div className="my-addresses-container">

        {/* =====================================
            TOP HEADER
        ====================================== */}

        <header className="my-addresses-header">

          <div className="address-header-left">

            <button
              type="button"
              className="my-addresses-back"
              onClick={onBack}
            >
              ← Back to My Profile
            </button>

            <div className="address-title">

              <span>
                ACCOUNT
              </span>

              <h1>
                My Addresses
              </h1>

              <p>
                Saved delivery addresses
                for faster checkout
              </p>

            </div>

          </div>

        </header>


        {/* =====================================
            ERROR
        ====================================== */}

        {error && (
          <div className="address-error">

            <div className="address-error-icon">
              ⚠️
            </div>

            <div>
              <strong>
                Something went wrong
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={
                fetchAddresses
              }
            >
              Try Again
            </button>

          </div>
        )}


        {/* =====================================
            MAIN TWO COLUMN AREA
        ====================================== */}

        {!error && (
          <div className="addresses-layout">

            {/* =================================
                LEFT SIDE - SAVED ADDRESSES
            ================================== */}

            <div className="saved-addresses-section">

              <div className="section-heading">

                <div>
                  <h2>
                    Saved Addresses
                  </h2>

                  <p>
                    {addresses.length === 0
                      ? "No saved addresses yet"
                      : `${addresses.length} saved ${
                          addresses.length === 1
                            ? "address"
                            : "addresses"
                        }`}
                  </p>
                </div>

              </div>


              {/* EMPTY */}

              {addresses.length === 0 && (

                <div className="empty-address-card">

                  <div className="empty-address-icon">
                    🏠
                  </div>

                  <h3>
                    No saved addresses
                  </h3>

                  <p>
                    Add your first delivery
                    address using the form.
                  </p>

                </div>

              )}


              {/* ADDRESS LIST */}

              <div className="my-addresses-list">

                {addresses.map(
                  (address) => (

                    <article
                      key={address.id}
                      className={
                        address.is_default
                          ? "my-address-card default-address-card"
                          : "my-address-card"
                      }
                    >

                      {/* CARD TOP */}

                      <div className="address-card-top">

                        <div className="address-main-info">

                          <div className="address-home-icon">
                            🏠
                          </div>

                          <div>

                            <h3>
                              {
                                address.full_name
                              }
                            </h3>

                            <p className="address-phone">
                              ☎{" "}
                              {address.phone}
                            </p>

                          </div>

                        </div>


                        {Boolean(
                          address.is_default
                        ) ? (

                          <span className="default-badge">
                            ⭐ Default
                          </span>

                        ) : (

                          <button
                            type="button"
                            className="set-default-button"
                            onClick={() =>
                              handleSetDefault(
                                address.id
                              )
                            }
                            disabled={
                              defaultLoading ===
                              address.id
                            }
                          >
                            {defaultLoading ===
                            address.id
                              ? "Setting..."
                              : "☆ Set as Default"}
                          </button>

                        )}

                      </div>


                      {/* ADDRESS */}

                      <div className="address-card-content">

                        <div className="address-location-icon">
                          📍
                        </div>

                        <p>
                          {
                            address.address_line
                          }
                        </p>

                      </div>


                      {/* LOCATION DETAILS */}

                      <div className="address-tags">

                        <span>
                          🏙{" "}
                          {address.city}
                        </span>

                        <span>
                          🗺{" "}
                          {address.state}
                        </span>

                        <span>
                          📌{" "}
                          {address.pincode}
                        </span>

                      </div>


                      {/* DEFAULT MESSAGE */}

                      {Boolean(
                        address.is_default
                      ) && (

                        <div className="default-message">
                          <span>
                            ✓
                          </span>

                          <p>
                            This is your default
                            delivery address.
                          </p>
                        </div>

                      )}


                      {/* CARD FOOTER */}

                      <div className="address-card-footer">

                        <button
                          type="button"
                          className="edit-address-button"
                        >
                          ✏ Edit
                        </button>

                        <button
                          type="button"
                          className="delete-address-button"
                          onClick={() =>
                            handleDelete(
                              address.id
                            )
                          }
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </article>
                  )
                )}

              </div>

            </div>


            {/* =================================
                RIGHT SIDE - NEW ADDRESS
            ================================== */}

            <aside className="new-address-section">

              <div className="new-address-header">

                <div className="new-address-icon">
                  +
                </div>

                <div>

                  <h2>
                    New Address
                  </h2>

                  <p>
                    Add a new delivery
                    address
                  </p>

                </div>

              </div>


              <form
                className="new-address-form"
                onSubmit={
                  handleAddAddress
                }
              >

                {/* FULL NAME */}

                <div className="address-input-group">

                  <label>
                    Full Name
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    placeholder="Enter your full name"
                    value={
                      form.full_name
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                {/* PHONE */}

                <div className="address-input-group">

                  <label>
                    Phone Number
                    <span>*</span>
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    maxLength="10"
                    required
                  />

                </div>


                {/* ADDRESS */}

                <div className="address-input-group">

                  <label>
                    Address
                    <span>*</span>
                  </label>

                  <textarea
                    name="address_line"
                    placeholder="House No, Street, Area, Landmark"
                    value={
                      form.address_line
                    }
                    onChange={
                      handleChange
                    }
                    rows="4"
                    required
                  />

                </div>


                {/* CITY + STATE */}

                <div className="address-input-row">

                  <div className="address-input-group">

                    <label>
                      City
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={
                        form.city
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  <div className="address-input-group">

                    <label>
                      State
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="state"
                      placeholder="Enter state"
                      value={
                        form.state
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                </div>


                {/* PINCODE */}

                <div className="address-input-group">

                  <label>
                    PIN Code
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    placeholder="6-digit PIN code"
                    value={
                      form.pincode
                    }
                    onChange={
                      handleChange
                    }
                    maxLength="6"
                    required
                  />

                </div>


                {/* SAVE */}

                <button
                  type="submit"
                  className="save-address-button"
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <span className="button-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      💾 Save Address
                    </>
                  )}

                </button>


                <p className="address-form-note">
                  Your first saved address
                  will automatically become
                  your default address.
                </p>

              </form>

            </aside>

          </div>
        )}

      </div>

    </section>
  );
}

export default MyAddresses;