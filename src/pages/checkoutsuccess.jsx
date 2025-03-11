"use client"

import { useRef } from "react"
import { useSelector } from "react-redux"
import { Check } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import InvoiceComponent from "./orderinvoice"

const CheckoutSuccess = () => {
  const currentOrder = useSelector((state) => state.order.currentOrder)
  const currentOrderpayload = useSelector((state) => state.order.currentOrderpayload)
  const sitedata = useSelector((state) => state.order.sitedata)
  const invoiceRef = useRef()

  const formatPrice = (price) => `৳ ${Number(price).toLocaleString("bn-BD")}`

  const handleDownloadInvoice = () => {
    if (invoiceRef.current) {
      invoiceRef.current.downloadInvoice()
    }
  }

  // Calculate total price from items
  const totalPrice = currentOrderpayload?.items?.reduce((sum, item) => sum + Number(item.total), 0) || 0
  const deliveryCharge = Number(currentOrderpayload?.delivery_charge || 0)
  const grandTotal = totalPrice + deliveryCharge

  return (
    <>
      <Header />
      <div className="col-md-5 m-auto">
        <div className="d-flex flex-column align-items-center">
          {/* Main Content */}
          <div className="bg-light w-100 max-w-50 mt-5 p-4 text-center">
            {/* Success Icon */}
            <div className="d-flex justify-content-center mb-4">
              <div
                className="bg-success rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "50px", height: "50px" }}
              >
                <Check className="text-white" />
              </div>
            </div>

            {/* Thank You Message */}
            <h1 className="h4 text-dark">Thank you for your purchase</h1>
            <p className="text-muted mt-2">We've received your order and will ship it in 5-7 business days.</p>
            <p className="text-muted mt-1">Your order number is #{currentOrderpayload?.invoice_number || "B6CT3"}.</p>

            {/* Order Summary */}
            <div className="bg-white p-4 rounded mt-4">
              <h2 className="h5 text-dark text-start">Order Summary</h2>
              <table className="table mt-3">
                <tbody>
                  {currentOrderpayload?.items?.map((item, index) => (
                    <tr key={index} className="border-bottom">
                      <td className="align-middle">
                        <img
                          src={item?.product?.featured_image || ""}
                          alt={item?.product?.product_name || "Product"}
                          className="rounded"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                      </td>
                      <td className="align-middle">{item.product?.product_name || "N/A"}</td>
                      <td className="align-middle text-end">{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" className="text-end text-muted">
                      Subtotal
                    </td>
                    <td className="text-end">{formatPrice(totalPrice)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="text-end text-muted">
                      Delivery Charge
                    </td>
                    <td className="text-end">{formatPrice(deliveryCharge)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="text-end text-muted">
                      Total
                    </td>
                    <td className="text-end fw-bold">{formatPrice(grandTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Back to Home Button */}
            <div className="mt-4">
              <button className="btn btn-outline-secondary" onClick={handleDownloadInvoice}>
                Download invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Invoice */}
      <div style={{ display: "none" }}>
        <InvoiceComponent
          ref={invoiceRef}
          currentOrder={currentOrderpayload}
          currentOrderpayload={currentOrder}
          sitedata={sitedata}
          formatPrice={formatPrice}
        />
      </div>
      <Footer />
    </>
  )
}

export default CheckoutSuccess

