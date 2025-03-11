import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../api/store/slices/orderSlice";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function Order() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error fetching orders: {error}</div>;
  }

  return (
    <div className="py-6 p-md-6 p-lg-10">
      <h2 className="mb-6">Your Orders</h2>

      <div className="table-responsive-xxl border-0">
        <table className="table mb-0 text-nowrap table-centered">
          <thead className="bg-light">
            <tr>
              <th>&nbsp;</th>
              <th>Product</th>
              <th>Order</th>
              <th>Date</th>
              <th>Items</th>
              <th>Status</th>
              <th>Amount</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {orders && Object.values(orders).map((order) => (
              order.items && order.items.map((item) => (
                <tr key={`${order.id}-${item.id}`}>
                  <td className="align-middle border-top-0 w-0">
                    <a href="#">
                      {item.product_info.featured_image ? (
                        <img
                          src={item.product_info.featured_image}
                          alt={item.product_info.product_name}
                          className="icon-shape icon-xl"
                        />
                      ) : (
                        <img
                          src="/api/placeholder/80/80"
                          alt="placeholder"
                          className="icon-shape icon-xl"
                        />
                      )}
                    </a>
                  </td>
                  <td className="align-middle border-top-0">
                    <a href="#" className="fw-semibold text-inherit">
                      <h6 className="mb-0">{item.product_info.product_name}</h6>
                    </a>
                    <span>
                      <small className="text-muted">
                        {item.product_info.product_code}
                      </small>
                    </span>
                  </td>
                  <td className="align-middle border-top-0">
                    <a href="#" className="text-inherit">
                      {order.invoice_number}
                    </a>
                  </td>
                  <td className="align-middle border-top-0">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="align-middle border-top-0">{item.quantity}</td>
                  <td className="align-middle border-top-0">
                    <span className={`badge ${getBadgeColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="align-middle border-top-0">
                    ${parseFloat(item.price).toFixed(2)}
                  </td>
                  {/* <td className="text-muted align-middle border-top-0">
                    <Link
                      to={"/checkout/success/"+order.invoice_number}
                      className="text-inherit"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td> */}
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function to determine badge color based on status
function getBadgeColor(status) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-success';
    case 'processing':
    case 'pending':
      return 'bg-warning';
    case 'cancel':
    case 'cancelled':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
}