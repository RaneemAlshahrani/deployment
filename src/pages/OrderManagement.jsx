import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/orderManagement.css";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/orders");
        const data = await res.json();

        setOrders(data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load orders");
      }
    };

    fetchOrders();
  }, []);

  const handleSelect = (order) => {
    setSelectedOrder(order);
    setStatus(order.status || "Processing");
    setMessage("");
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/orders/${selectedOrder._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      setSelectedOrder(updatedOrder);
      setMessage("Order status updated!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update order status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB");
  };

  const formatMoney = (value) => {
    return `$${Number(value || 0).toFixed(2)}`;
  };

  return (
    <div className="purple-page order-page">
      <div className="order-layout">
        <AdminSidebar activePage="orders" />

        <div className="order-main">
          <div className="orders-panel">
            <h2>Orders</h2>

            {message && (
              <p
                style={{
                  color: "#ff4d6d",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {message}
              </p>
            )}

            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => handleSelect(order)}
                      className={
                        selectedOrder?._id === order._id ? "selected" : ""
                      }
                    >
                      <td>#{order._id.slice(-5)}</td>
                      <td>{order.userId || "User"}</td>
                      <td>{formatMoney(order.totalPrice)}</td>
                      <td>
                        <span
                          className={`status ${(
                            order.status || "Processing"
                          ).toLowerCase()}`}
                        >
                          {order.status || "Processing"}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="details-panel">
            <h2>Details</h2>

            {selectedOrder ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedOrder.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="product-cell">
                          {item.name || "Product"}
                        </td>

                        <td>{formatMoney(item.price)}</td>
                        <td>{item.quantity || 1}</td>
                        <td>
                          {formatMoney(
                            Number(item.price || 0) *
                              Number(item.quantity || 1)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="update-section">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button className="update-btn" onClick={handleUpdate}>
                    Update
                  </button>
                </div>
              </>
            ) : (
              <p>Select an order to see details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;