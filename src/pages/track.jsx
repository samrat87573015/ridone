import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

export default function TrackOrder() {
  const [trackingNumber, setTrackingNumber] = useState('INV-12-02-24-6476');
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch order data
  const fetchOrderData = async (trackingNum) => {
    setOrderData([]);  // Clear previous order data
    setLoading(true);   // Start loading state
    setError(null);     // Clear any previous errors
    try {
      const response = await axiosInstance.post(`/orders/filter`, { key: trackingNum });
      const data = response.data;
      setOrderData(data.data);  // Assuming 'data' contains an array of orders
    } catch (err) {
      // setError('There was an error fetching the order data');  // Handle errors
    } finally {
      setLoading(false);  // Set loading to false when request is done
    }
  };

  // Handle track button click
  const handleTrackClick = () => {
    if (trackingNumber) {
      fetchOrderData(trackingNumber);  // Trigger the fetch on button click
    }
  };

  // // Initial fetch on component mount
  // useEffect(() => {
  //   if (trackingNumber) {
  //     fetchOrderData(trackingNumber);
  //   }
  // }, [trackingNumber]);  // Depend on trackingNumber to refetch on change

  return (
    <>
      <Header />
      <main>
        <section className="mb-lg-14 mb-8 mt-8">
          <div className="container">
            <div className="col-12">
              <div className="tracking-container">
                <div className="tracking-input-container">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="tracking-input"
                    placeholder="Enter Invoice or Phone number..."
                  />
                  <button
                    className="tracking-button"
                    onClick={handleTrackClick}
                    disabled={loading}  // Disable button during loading
                  >
                    {loading ? 'Tracking...' : 'Track Now'}
                  </button>
                </div>

                {error && (
                  <div className="error-message mt-4 text-red-500">
                    {error}
                  </div>
                )}

                {loading && (
                  <div className="loading-message mt-4 text-blue-500">
                    Searching for your order...
                  </div>
                )}

                {orderData.length > 0 ? (
                  <div className="order-details mt-4">
                    <h3 className="text-lg font-semibold">Orders </h3>

                    {/* Orders Table */}
                    <table className="order-table w-full mt-4 border-collapse" style={{width:'-webkit-fill-available'}}>
                      <thead>
                        <tr>
                          <th className="border p-2">Order ID</th>
                          {/* <th className="border p-2">Customer Name</th> */}
                          <th className="border p-2">Product Info</th>
                          {/* <th className="border p-2">Address</th> */}
                          {/* <th className="border p-2">Phone Number</th> */}
                          {/* <th className="border p-2">Email</th> */}
                          <th className="border p-2">Order Status</th>
                          <th className="border p-2">Couriar Status</th>
                          <th className="border p-2">Total Price</th>
                        
                          <th className="border p-2">Delivery Charge</th>

                        </tr>
                      </thead>
                      <tbody>
                        {orderData.map((order) => (
                          <tr key={order.id}>
                            <td className="border p-2">{order.invoice_number}</td>
                            
                            {/* <td className="border p-2">{order.customer_name}</td> */}
                            <td className="border p-2">
                              
                                 {/* Order Items Table */}
                    {orderData.map((order) => (
                      <div key={order.id}>
   
                        <table className="order-items-table w-full mt-2 border-collapse" style={{width:'-webkit-fill-available'}}>
                          
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index}>
                                <td className="border p-2">
                                  <img src={item.product_info.featured_image} style={{width:'50px'}}/>
                                  
                                  </td>
                                <td className="border p-2">
                                  {item.product_info.product_name}<br/>
                                  {item.product_info.product_code}<br/>
                                  {item.quantity} * {item.price}
                           
                                  </td>
                          
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}

                            </td>
                            {/* <td className="border p-2">{order.customer_address.address}</td> */}
                            {/* <td className="border p-2">{order.phone_number}</td> */}
                            {/* <td className="border p-2">{order.email}</td> */}
                            <td className="border p-2">{order.order_status}</td>
                            <td className="border p-2">
  <label>Status: {order.couriar_status || "Couriar never toggled yet"}</label>
  {order.couriar_name && (
    <label>Name: {order.couriar_name}</label>
  )}
  {order.consignment_id && (
    <label>Consignment-ID: {order.consignment_id}</label>
  )}
  {order.tracking_code && (
    <Link to={order.tracking_code}>Tracking-Code</Link>
  )}
</td>


                            <td className="border p-2">{order.total_price}</td>
                       
                            <td className="border p-2">{order.delivery_charge}</td>

                          </tr>
                        ))}
                      </tbody>
                    </table>

                 
                  </div>
                ) : (
                  !loading && (
                    <div className="mt-4">No orders found for this tracking number.</div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
