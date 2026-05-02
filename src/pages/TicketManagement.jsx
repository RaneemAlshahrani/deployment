import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import rose from "../assets/rose.png";
import rosemary from "../assets/rosemary.png";
import logo from "../assets/bubble-logo.png";
import "../styles/ticketManagement.css";
import { getAuthToken } from "../utils/auth";

function TicketManagement() {
 const navigate = useNavigate();

 // MongoDB
 const [tickets, setTickets] = useState([]);
 const [users, setUsers] = useState({}); // Cache for user profiles
 const [loading, setLoading] = useState(true);

 const loadTickets = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch("http://localhost:5000/api/tickets", {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    setTickets(data);
  } catch (error) {
    console.error("Error loading tickets:", error);
  } finally {
    setLoading(false);
  }
 };

 useEffect(() => {
  loadTickets();
 }, []);

 const [filterStatus, setFilterStatus] = useState("All");
 const [ticketSearch, setTicketSearch] = useState("");
 const [selectedTicketId, setSelectedTicketId] = useState(null);

 const selectedTicket =
   tickets.find((ticket) => ticket._id === selectedTicketId) || tickets[0] || {};

 const [issueType, setIssueType] = useState("");
 const [refundEligibility, setRefundEligibility] = useState("");
 const [status, setStatus] = useState("");
 const [note, setNote] = useState("");
 const [savedMessage, setSavedMessage] = useState("");

 useEffect(() => {
  if (selectedTicket._id) {
    setIssueType(selectedTicket.issueType || "");
    setRefundEligibility(selectedTicket.refundEligibility || "");
    setStatus(selectedTicket.status || "Pending");
  }
 }, [selectedTicket]);

 // Filter tickets
 const filteredTickets = tickets.filter((ticket) => {
   const matchesStatus =
     filterStatus === "All" || ticket.status === filterStatus;

   const matchesSearch = ticket._id
     ?.toLowerCase()
     .includes(ticketSearch.toLowerCase()) ||
     ticket.customer?.toLowerCase().includes(ticketSearch.toLowerCase()) ||
     ticket.email?.toLowerCase().includes(ticketSearch.toLowerCase());

   return matchesStatus && matchesSearch;
 });

 const handleSelectTicket = (ticket) => {
   setSelectedTicketId(ticket._id);
   setNote("");
   setSavedMessage("");
 };

 // Update ticket
 const handleUpdate = async () => {
   if (!selectedTicket?._id) return;

   try {
     const token = getAuthToken();
     await fetch(`http://localhost:5000/api/tickets/${selectedTicket._id}`, {
       method: "PUT",
       headers: { 
         "Content-Type": "application/json",
         "Authorization": token ? `Bearer ${token}` : ""
       },
       body: JSON.stringify({
         issueType,
         refundEligibility,
         status,
       }),
     });

     await loadTickets();
     setSavedMessage("Saved!");
     setTimeout(() => setSavedMessage(""), 3000);
   } catch (error) {
     console.error("Error updating ticket:", error);
     setSavedMessage("Error saving!");
   }
 };

 const getStatusColor = (status) => {
   switch (status?.toLowerCase()) {
     case 'pending': return '#ffd7c9';
     case 'open': return '#d8e7ff';
     case 'processed': return '#d7f2d4';
     default: return '#e0e0e0';
   }
 };

 const getStatusTextColor = (status) => {
   switch (status?.toLowerCase()) {
     case 'pending': return '#d96a3a';
     case 'open': return '#3d6fd1';
     case 'processed': return '#3d9b44';
     default: return '#666';
   }
 };

 if (loading) {
   return (
     <div className="purple-page ticket-page">
       <div className="ticket-layout">
         <div className="cs-sidebar">
           <div className="cs-logo-card">
             <img src={logo} alt="Bubble Logo" />
           </div>
           <button className="active">Ticket Management</button>
           <button onClick={() => navigate("/customer-service/faqs")}>FAQ Templates</button>
           <div className="cs-spacer" />
           <button onClick={() => navigate("/")}>Log out</button>
         </div>
         <div style={{ textAlign: "center", padding: "50px" }}>Loading tickets...</div>
       </div>
     </div>
   );
 }

 return (
   <div className="purple-page ticket-page">
     <div className="ticket-layout">

       {/* Sidebar */}
       <div className="cs-sidebar">
         <div className="cs-logo-card">
           <img src={logo} alt="Bubble Logo" />
         </div>

         <button className="active">Ticket Management</button>

         <button onClick={() => navigate("/customer-service/faqs")}>
           FAQ Templates
         </button>

         <div className="cs-spacer" />

         <button onClick={() => navigate("/")}>Log out</button>
       </div>

       {/* Main */}
       <div className="ticket-main">

         {/* Top panel */}
         <div className="ticket-top-panel">
           <div className="ticket-filter-row">
             <input
               type="text"
               placeholder="Search by Ticket ID, Customer, or Email"
               value={ticketSearch}
               onChange={(e) => setTicketSearch(e.target.value)}
             />

             <select
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
             >
               <option value="All">Filter By: All</option>
               <option value="Pending">Filter By: Pending</option>
               <option value="Open">Filter By: Open</option>
               <option value="Processed">Filter By: Processed</option>
             </select>
           </div>

           <table className="ticket-table">
             <thead>
               <tr>
                 <th>Ticket ID</th>
                 <th>Order ID</th>
                 <th>Customer</th>
                 <th>Email</th>
                 <th>Status</th>
                 <th>Date</th>
               </tr>
             </thead>

             <tbody>
               {filteredTickets.length > 0 ? (
                 filteredTickets.map((ticket) => (
                   <tr
                     key={ticket._id}
                     className={selectedTicketId === ticket._id ? "selected" : ""}
                     onClick={() => handleSelectTicket(ticket)}
                     style={{ cursor: "pointer" }}
                   >
                     <td style={{ fontSize: "12px" }}>{ticket._id?.slice(-8)}</td>
                     <td>{ticket.orderNumber || "N/A"}</td>
                     <td><strong>{ticket.customer || "Guest"}</strong></td>
                     <td style={{ fontSize: "12px" }}>{ticket.email || "No email"}</td>
                     <td>
                       <span 
                         className="ticket-status"
                         style={{
                           backgroundColor: getStatusColor(ticket.status),
                           color: getStatusTextColor(ticket.status),
                           padding: "4px 10px",
                           borderRadius: "12px",
                           fontSize: "12px",
                           fontWeight: "600"
                         }}
                       >
                         {ticket.status || "Pending"}
                       </span>
                     </td>
                     <td>{ticket.date || new Date(ticket.createdAt).toLocaleDateString()}</td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                     No tickets found.
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>

         {/* Details */}
         <div className="ticket-details-panel">
           <div className="ticket-info-card">
             <h2>Ticket #{selectedTicket?._id?.slice(-8)}</h2>

             <div className="ticket-info-table">
               <div className="ticket-info-item">
                 <div className="ticket-info-head">Full Name</div>
                 <div className="ticket-info-value">{selectedTicket.customer || "N/A"}</div>
               </div>

               <div className="ticket-info-item">
                 <div className="ticket-info-head">Email</div>
                 <div className="ticket-info-value" style={{ wordBreak: "break-all" }}>
                   {selectedTicket.email || "N/A"}
                 </div>
               </div>

               <div className="ticket-info-item">
                 <div className="ticket-info-head">Phone Number</div>
                 <div className="ticket-info-value">{selectedTicket.phone || "N/A"}</div>
               </div>

               <div className="ticket-info-item">
                 <div className="ticket-info-head">Order Number</div>
                 <div className="ticket-info-value">{selectedTicket.orderNumber || "N/A"}</div>
               </div>
             </div>
           </div>

           <div className="ticket-content-grid">
             <div className="ticket-message-card">
               <div className="ticket-field">
                 <label>Subject</label>
                 <input 
                   type="text" 
                   value={selectedTicket.subject || ""} 
                   readOnly 
                   style={{ backgroundColor: "#f5f5f5", cursor: "default" }}
                 />
               </div>

               <div className="ticket-field">
                 <label>Message</label>
                 <textarea 
                   value={selectedTicket.message || ""} 
                   readOnly 
                   rows={8}
                   style={{ backgroundColor: "#f5f5f5", cursor: "default" }}
                 />
               </div>
             </div>

             <div className="ticket-actions-card">
               <div className="ticket-field">
                 <label>Issue Type</label>
                 <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                   <option>Refund</option>
                   <option>Wrong Order</option>
                   <option>Missing Item</option>
                   <option>Late Delivery</option>
                   <option>Other</option>
                 </select>
               </div>

               <div className="ticket-field">
                 <label>Refund Eligibility</label>
                 <select value={refundEligibility} onChange={(e) => setRefundEligibility(e.target.value)}>
                   <option>Approve</option>
                   <option>Reject</option>
                   <option>Pending</option>
                 </select>
               </div>

               <div className="ticket-field">
                 <label>Status</label>
                 <select value={status} onChange={(e) => setStatus(e.target.value)}>
                   <option>Pending</option>
                   <option>Open</option>
                   <option>Processed</option>
                 </select>
               </div>

               <div className="ticket-field">
                 <label>Internal Note</label>
                 <textarea
                   rows={6}
                   placeholder="Write internal note..."
                   value={note}
                   onChange={(e) => setNote(e.target.value)}
                 />
               </div>

               <div className="ticket-button-column">
                 <button className="update-btn" onClick={handleUpdate}>
                   Update
                 </button>

                 {savedMessage && (
                   <span className="ticket-message saved" style={{ color: savedMessage.includes("Error") ? "#ff4d6d" : "#39a86f" }}>
                     {savedMessage}
                   </span>
                 )}
               </div>
             </div>
           </div>

           <div className="ticket-order-card">
             <h3>Order Items</h3>

             {selectedTicket?.orderItems?.length > 0 ? (
               <table className="ticket-table">
                 <thead>
                   <tr>
                     <th>Product</th>
                     <th>Price</th>
                     <th>Quantity</th>
                     <th>Subtotal</th>
                   </tr>
                 </thead>

                 <tbody>
                   {selectedTicket.orderItems.map((item, index) => (
                     <tr key={index}>
                       <td className="product-cell">
                         <img src={item.image || rose} alt={item.name} style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                         {item.name}
                       </td>
                       <td>${Number(item.price || 0).toFixed(2)}</td>
                       <td>{item.qty || 1}</td>
                       <td>${(Number(item.price || 0) * (item.qty || 1)).toFixed(2)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : (
               <p style={{ textAlign: "center", padding: "20px" }}>No order items found for this ticket.</p>
             )}
           </div>

         </div>
       </div>
     </div>
   </div>
 );
}

export default TicketManagement;