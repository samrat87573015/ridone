import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getUserData,
} from "../../api/store/slices/userSlice";

import { useToast } from "../ToastContext";
import AddressForm from "../auth/account/AddressForm";
const Address = () => {
  const dispatch = useDispatch();
  const { user, addresses, loading, error } = useSelector(
    (state) => state.user || {}
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { showToast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          await dispatch(fetchAddresses()).unwrap();
        } else {
          await dispatch(getUserData()).unwrap();
          await dispatch(fetchAddresses()).unwrap();
        }
      } catch (err) {
        console.error("Failed to fetch user data or addresses:", err);
      }
    };

    fetchData();
  }, [user, dispatch]);

  const handleAddAddress = async (values) => {
    try {
      await dispatch(createAddress(values)).unwrap();
      setModalVisible(false);
      showToast("Address add successfully", "success");
    } catch (err) {
      console.error("Failed to add address:", err);
      showToast(err, "error");
    }
  };

  const handleUpdateAddress = async (values) => {
    try {
      await dispatch(
        updateAddress({ id: editingAddress.id, data: values })
      ).unwrap();
      setModalVisible(false);
      setEditingAddress(null);
      showToast("Address update successfully", "success");
    } catch (err) {
      console.error("Failed to update address:", err);
      showToast(err, "error");
    }
  };
  const handleDeleteAddress = async (id) => {
    try {
      await dispatch(deleteAddress({ id })).unwrap();
      setModalVisible(false);
      setEditingAddress(null);
      showToast("Address delete successfully", "success");
    } catch (err) {
      console.error("Failed to delete address:", err);
      showToast(err, "error");
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setModalVisible(true);
  };

  const setAsDefault = async (address) => {
    try {
      const updatedAddress = { ...address, is_default: true }; // Set default flag
      await dispatch(
        updateAddress({ id: address.id, data: updatedAddress })
      ).unwrap();
      showToast("Address set as default successfully", "success");
      console.log("Address set as default successfully");
    } catch (err) {
      console.error("Failed to set address as default:", err);
      showToast(err, "error");
    }
  };

  return (
    <>
     {user?
      
      <main>
      <section>
        <div className="container">
          <div className="row">
         
            {/* Main Content */}
            <div className="col-lg-12 col-md-12 col-12">
              <div className="">
                {/* Header */}
                <div className="d-flex justify-content-end mb-6">

                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setEditingAddress(null);
                      setModalVisible(true);
                    }}
                  >
                    Add New Address
                  </button>
                </div>

                {/* Loading & Error States */}
                {loading && <div className="text-center">Loading...</div>}
                {error && (
                  <div className="alert alert-danger">
                    {typeof error === "object"
                      ? JSON.stringify(error, null, 2)
                      : error}
                  </div>
                )}

                {/* Address List */}
                <div className="row">
                  {addresses?.map((address) => (
                    <div
                      key={address.id}
                      className="col-xl-5 col-lg-6 col-xxl-4 col-12 mb-4"
                    >
                      <div className="card">
                        <div className="card-body p-6">
                          <div className="form-check mb-4">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id={`addressRadio-${address.id}`}
                              checked={address.is_default}
                              readOnly
                            />
                            <label
                              className="form-check-label text-dark fw-semibold"
                              htmlFor={`addressRadio-${address.id}`}
                            >
                              {address.type}
                            </label>
                          </div>
                          <p className="mb-6">
                            {address.name}
                            <br />
                            {address.address}
                            <br />
                            {address.city}
                            <br />
                            {address.phone}
                          </p>
                          {address.is_default ? (
                            <button className="btn btn-info btn-sm">
                              Default Address
                            </button>
                          ) : (
                            <a
                              href="#"
                              className="link-primary"
                              onClick={() => setAsDefault(address)}
                            >
                              Set as Default
                            </a>
                          )}
                         
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Add/Edit Address */}
        {modalVisible && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingAddress ? "Edit Address" : "Add New Address"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setModalVisible(false);
                      setEditingAddress(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <AddressForm
                    initialValues={editingAddress}
                    onSubmit={
                      editingAddress ? handleUpdateAddress : handleAddAddress
                    }
                    onCancel={() => {
                      setModalVisible(false);
                      setEditingAddress(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Backdrop */}
        {modalVisible && <div className="modal-backdrop fade show"></div>}
      </section>
    </main>
      : <input class="form-control ckb" name="bill_address" type="text" required="" value="" placeholder="আপনার ঠিকানা (গ্রাম, থানা, জেলা) লিখুন"/>}
    </>
   
    
  );
};

export default Address;
