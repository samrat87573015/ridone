import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getUserData,
} from "../../../api/store/slices/userSlice";
import AddressForm from "./AddressForm";
import Sidebar from "./sidebar";
import { useToast } from "../../ToastContext";

const Address = () => {
  const dispatch = useDispatch();
  const { user, addresses, loading, error } = useSelector((state) => state.user || {});

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showToast } = useToast();

  // Single useEffect for initial data fetching
  useEffect(() => {
    const initializeData = async () => {
      if (!isInitialized) {
        try {
          if (!user) {
            await dispatch(getUserData()).unwrap();
          }
          await dispatch(fetchAddresses()).unwrap();
          setIsInitialized(true);
        } catch (err) {
          console.error("Failed to initialize data:", err);
          showToast("Failed to load data", "error");
        }
      }
    };

    initializeData();
  }, [dispatch, user, isInitialized]);

  const handleAddAddress = async (values) => {
    try {
      await dispatch(createAddress(values)).unwrap();
      setModalVisible(false);
      showToast("Address added successfully", "success");
    } catch (err) {
      console.error("Failed to add address:", err);
      showToast(err, "error");
    }
  };

  const handleUpdateAddress = async (values) => {
    try {
      await dispatch(updateAddress({ id: editingAddress.id, data: values })).unwrap();
      setModalVisible(false);
      setEditingAddress(null);
      showToast("Address updated successfully", "success");
    } catch (err) {
      console.error("Failed to update address:", err);
      showToast(err, "error");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await dispatch(deleteAddress({ id })).unwrap();
      showToast("Address deleted successfully", "success");
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
      const updatedAddress = { ...address, is_default: true };
      await dispatch(updateAddress({ id: address.id, data: updatedAddress })).unwrap();
      showToast("Address set as default successfully", "success");
    } catch (err) {
      console.error("Failed to set address as default:", err);
      showToast(err, "error");
    }
  };
  const RemoveAsDefault = async (address) => {
    try {
      const updatedAddress = { ...address, is_default: false };
      await dispatch(updateAddress({ id: address.id, data: updatedAddress })).unwrap();
      showToast("Address set as default successfully", "success");
    } catch (err) {
      console.error("Failed to set address as default:", err);
      showToast(err, "error");
    }
  };

  

  return (
    <main>
      <section>
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4 col-12 border-end d-none d-md-block">
              <div className="pt-10 pe-lg-10">
                <Sidebar />
              </div>
            </div>
            {/* Main Content */}
            <div className="col-lg-9 col-md-8 col-12">
              <div className="py-6 p-md-6 p-lg-10">
                {/* Header */}
                <div className="d-flex justify-content-between mb-6">
                  <h2 className="mb-0">Address</h2>
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
                {!isInitialized && loading?.fetchAddresses?<div className="text-center py-6">Loading...</div>:null}

                {/* Error State */}
                {error && (
                  <div className="alert alert-danger">
                    {typeof error === "object" ? JSON.stringify(error, null, 2) : error}
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
                          {/* <div className="form-check mb-4">
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
                          </div> */}
                          <label
                              className="form-check-label text-dark fw-semibold"
                              htmlFor={`addressRadio-${address.id}`}
                            >
                              {address.type}
                            </label>
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
                            <button className="btn btn-info btn-sm"
                            onClick={(e)=>{
                              
                              e.preventDefault();
                              RemoveAsDefault(address);
                            }}
                            >
                              Default Address
                            </button>
                          ) : (
                            <a
                              href="#"
                              className="link-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                setAsDefault(address);
                              }}
                            >
                              Set as Default
                            </a>
                          )}
                          <div className="mt-4">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEdit(address)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              Delete
                            </button>
                          </div>
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
                    onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
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
  );
};

export default Address;