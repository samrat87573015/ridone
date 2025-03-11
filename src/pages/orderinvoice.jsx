import React, { forwardRef } from "react";
import html2pdf from "html2pdf.js";

const InvoiceComponent = forwardRef(({ currentOrder, formatPrice, currentOrderpayload,sitedata }, ref) => {
  const invoiceRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
    downloadInvoice: () => {
      const element = invoiceRef.current;
      const options = {
        margin: [10, 10],
        filename: `Invoice_${currentOrder?.invoice_number || "Order"}.pdf`,
        html2canvas: { scale: 1 },
        jsPDF: { format: "a4", orientation: "portrait" },
      };

      html2pdf().set(options).from(element).save();
    },
  }));

  return (
    <div ref={invoiceRef} className="invoice-container p-4 bg-white">
      {/* Header */}
      <div className="text-center mb-4">
        {/* <img
          src={sitedata?.app_name}
          alt={sitedata?.app_name}
          style={{ maxWidth: "150px" }}
        /> */}
        <h1 className="mt-3">Invoice</h1>
        <p>
          <strong>{currentOrder?.invoice_number || "Order"}</strong> |{" "}
          {currentOrder?.created_at
            ? new Date(currentOrder.created_at).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      {/* Billing and Shipping Info */}
      <div className="row mb-4">
        <div className="col-6">
          <h4>Billing Information</h4>
          <p>
            <strong>Name:</strong> {currentOrder?.customer_name || "N/A"} <br />
            <strong>Email:</strong> {currentOrder?.email || "N/A"} <br />
            <strong>Phone Number:</strong> {currentOrder?.phone_number || "N/A"} <br />
            <strong>Address:</strong> {currentOrder?.address || "N/A"} <br />
          </p>
        </div>
        <div className="col-6 text-end">
          <h4>Shipping Information</h4>
          <p>
            <strong>Delivery Type:</strong> {currentOrder?.delivery || "N/A"} <br />
            <strong>Shipping Price:</strong>{" "}
            {formatPrice(currentOrder?.shipping_price || 0)} <br />
            <strong>Delivery Charge:</strong>{" "}
            {formatPrice(currentOrder?.delivery_charge || 0)} <br />
          </p>
        </div>
      </div>

      {/* Order Details */}
      <h4 className="mb-3">Order Details</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Product</th>
            <th>Attributes</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {currentOrder?.items?.map((item, index) => {
            // Find matching attributes from currentOrderpayload for this item
            const matchingPayloadItem = currentOrderpayload?.items?.find(
              (payloadItem) => payloadItem.product_id === item.product.id
            );

            return (
              <tr key={index}>
                <td>
                  <img
                    src={item.product?.featured_image || ""}
                    alt={item.product?.product_name || "Product"}
                    style={{ width: "50px", marginRight: "10px" }}
                  />
                  {item.product?.product_name || "N/A"}
                </td>
                <td>
                  {matchingPayloadItem?.attributes && matchingPayloadItem.attributes.length > 0 ? (
                    matchingPayloadItem.attributes.map((attr, idx) => (
                      <div key={idx} className="text-muted">
                        <small>
                          {attr.attribute_name}: {attr.attribute_option}
                        </small>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted">
                      <small>No attributes available</small>
                    </div>
                  )}
                </td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.individual_price)}</td>
                <td>{formatPrice(item.campaign_discount || 0)}</td>
                <td>{formatPrice(item.total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Total */}
      <div className="text-end mt-4">
        <h5>Total Price: {formatPrice(currentOrder?.total_price || 0)}</h5>
        <h4 className="fw-bold">
          Grand Total:{" "}
          {formatPrice(
            (currentOrder?.total_price || 0) + (currentOrder?.delivery_charge || 0)
          )}
        </h4>
      </div>

      {/* Footer */}
      <div className="text-center mt-5">
        <p>© 2024 {sitedata?.app_name}. All Rights Reserved.</p>
      </div>
    </div>
  );
});

export default InvoiceComponent;
