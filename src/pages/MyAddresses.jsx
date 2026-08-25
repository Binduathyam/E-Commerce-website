import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./MyAddresses.css";

function MyAddresses({
  loggedInUser,
  onBack,
}) {
  const [addresses, setAddresses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* =========================================
     FETCH ADDRESSES
  ========================================= */

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

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch addresses"
        );
      }

      /*
        Remove duplicate addresses
        without deleting anything
        from database.
      */

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
            uniqueAddresses.push(
              address
            );
          }
        }
      );

      setAddresses(
        uniqueAddresses
      );

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

  /* =========================================
     FORM CHANGE
  ========================================= */

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

  /* =========================================
     ADD ADDRESS
  ========================================= */

  const handleAddAddress = async (
    event
  ) => {
    event.preventDefault();

    if (!loggedInUser?.id) {
      return;
    }

    try {
      setSaving(true);

      const response =
        await fetch(
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
                form.full_name,

              phone:
                form.phone,

              address_line:
                form.address_line,

              city:
                form.city,

              state:
                form.state,

              pincode:
                form.pincode,
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

      setForm({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
      });

      setShowAddForm(false);

      await fetchAddresses();

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

  /* =========================================
     DELETE ADDRESS
  ========================================= */

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

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/api/addresses/${addressId}`,
          {
            method: "DELETE",
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

      setAddresses(
        (previous) =>
          previous.filter(
            (address) =>
              address.id !==
              addressId
          )
      );

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

  return (
    <section className="my-addresses-page">

      <div className="my-addresses-container">

        {/* =====================================
            HEADER
        ====================================== */}

        <header className="my-addresses-header">

          <button
            type="button"
            className="my-addresses-back"
            onClick={onBack}
          >
            ← My Profile
          </button>

          <div>
            <p>
              ACCOUNT
            </p>

            <h1>
              My Addresses
            </h1>

            <span>
              Saved delivery addresses
            </span>
          </div>

          <button
            type="button"
            className="my-addresses-add-top"
            onClick={() =>
              setShowAddForm(
                (previous) =>
                  !previous
              )
            }
          >
            + Add Address
          </button>

        </header>


        {/* =====================================
            ADD ADDRESS FORM
        ====================================== */}

        {showAddForm && (

          <form
            className="address-form"
            onSubmit={
              handleAddAddress
            }
          >

            <div className="address-form-header">

              <div>
                <p>
                  NEW ADDRESS
                </p>

                <h2>
                  Add Delivery Address
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddForm(false)
                }
              >
                ✕
              </button>

            </div>


            <div className="address-form-grid">

              <div>
                <label>
                  Full Name
                </label>

                <input
                  name="full_name"
                  value={
                    form.full_name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>


              <div>
                <label>
                  Phone
                </label>

                <input
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>


              <div className="address-form-full">

                <label>
                  Address
                </label>

                <textarea
                  name="address_line"
                  value={
                    form.address_line
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              <div>
                <label>
                  City
                </label>

                <input
                  name="city"
                  value={
                    form.city
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>


              <div>
                <label>
                  State
                </label>

                <input
                  name="state"
                  value={
                    form.state
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>


              <div>
                <label>
                  Pincode
                </label>

                <input
                  name="pincode"
                  value={
                    form.pincode
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

            </div>


            <div className="address-form-actions">

              <button
                type="button"
                onClick={() =>
                  setShowAddForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Address"}
              </button>

            </div>

          </form>
        )}


        {/* =====================================
            LOADING
        ====================================== */}

        {loading && (
          <div className="my-addresses-message">

            <div>
              📍
            </div>

            <h2>
              Loading addresses...
            </h2>

            <p>
              Please wait.
            </p>

          </div>
        )}


        {/* =====================================
            ERROR
        ====================================== */}

        {!loading &&
          error && (
            <div className="my-addresses-message error">

              <div>
                ⚠️
              </div>

              <h2>
                Something went wrong
              </h2>

              <p>
                {error}
              </p>

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
            EMPTY
        ====================================== */}

        {!loading &&
          !error &&
          addresses.length === 0 && (

            <div className="my-addresses-message">

              <div>
                📍
              </div>

              <h2>
                No saved addresses
              </h2>

              <p>
                Add an address for
                faster checkout.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowAddForm(true)
                }
              >
                + Add New Address
              </button>

            </div>
          )}


        {/* =====================================
            ADDRESS LIST
        ====================================== */}

        {!loading &&
          !error &&
          addresses.length > 0 && (

            <div className="my-addresses-list">

              {addresses.map(
                (address) => (

                  <article
                    className="my-address-card"
                    key={address.id}
                  >

                    <div className="my-address-card-header">

                      <div className="my-address-icon">
                        📍
                      </div>

                      <div>
                        <p>
                          SAVED ADDRESS
                        </p>

                        <h2>
                          {
                            address.full_name
                          }
                        </h2>
                      </div>

                    </div>


                    <div className="my-address-card-body">

                      <p>
                        {address.phone}
                      </p>

                      <p>
                        {
                          address.address_line
                        }
                      </p>

                      <p>
                        {address.city}

                        {address.state
                          ? `, ${address.state}`
                          : ""}
                      </p>

                      <p>
                        {address.pincode}
                      </p>

                    </div>


                    <div className="my-address-card-footer">

                      <span>
                        SAVED ADDRESS
                      </span>

                      <div>

                        <button
                          type="button"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              address.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>
          )}

      </div>

    </section>
  );
}

export default MyAddresses;