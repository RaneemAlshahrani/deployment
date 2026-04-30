import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import rose from "../assets/rose.png";
import rosemary from "../assets/rosemary.png";
import logo from "../assets/bubble-logo.png";
import "../styles/ticketManagement.css";

function TicketManagement() {
 const navigate = useNavigate();

 // ✅ MongoDB
 const [tickets, setTickets] = useState([]);

 const loadTickets = async () => {
  const data = await fetch("http://localhost:5000/api/tickets")
    .then(res => res.json());
  setTickets(data);
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

 // ✅ لما تختارين تذكرة
 useEffect(() => {
  if (selectedTicket._id) {
    setIssueType(selectedTicket.issueType || "");
    setRefundEligibility(selectedTicket.refundEligibility || "");
    setStatus(selectedTicket.status || "Pending");
  }
 }, [selectedTicket]);

 // ✅ filter
 const filteredTickets = tickets.filter((ticket) => {
   const matchesStatus =
     filterStatus === "All" || ticket.status === filterStatus;

   const matchesSearch = ticket._id
     ?.toLowerCase()
     .includes(ticketSearch.toLowerCase());

   return matchesStatus && matchesSearch;
 });

 const handleSelectTicket = (ticket) => {
   setSelectedTicketId(ticket._id);
   setNote("");
   setSavedMessage("");
 };

 // ✅ UPDATE → MongoDB
 const handleUpdate = async () => {
   if (!selectedTicket?._id) return;

   await fetch(`http://localhost:5000/api/tickets/${selectedTicket._id}`, {
     method: "PUT",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       issueType,
       refundEligibility,
       status,
     }),
   });

   await loadTickets();
   setSavedMessage("Saved!");
 };

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
               placeholder="Search by Ticket ID"
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
                 <th>Order ID.</th>
                 <th>Customer</th>
                 <th>Amount</th>
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
                   >
                     <td>{ticket._id}</td>
                     <td>{ticket.orderNumber}</td>
                     <td>{ticket.customer}</td>
                     <td>{ticket.amount}</td>
                     <td>
                       <span className={`ticket-status ${ticket.status?.toLowerCase()}`}>
                         {ticket.status}
                       </span>
                     </td>
                     <td>{ticket.date}</td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan="6">No tickets found.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>

         {/* Details */}
         <div className="ticket-details-panel">
           <div className="ticket-info-card">
             <h2>Ticket {selectedTicket?._id}</h2>

             <div className="ticket-info-table">
               <div className="ticket-info-item">
                 <div className="ticket-info-head">Full Name</div>
                 <div className="ticket-info-value">{selectedTicket.customer}</div>
               </div>

               <div className="ticket-info-item">
                 <div className="ticket-info-head">Email</div>
                 <div className="ticket-info-value">{selectedTicket.email}</div>
               </div>

               <div className="ticket-info-item">
                 <div className="ticket-info-head">Phone Number</div>
                 <div className="ticket-info-value">{selectedTicket.phone}</div>
               </div>

               <div className="ticket-info-item">
                 <div className="ticket-info-head">Order Number</div>
                 <div className="ticket-info-value">{selectedTicket.orderNumber}</div>
               </div>
             </div>
           </div>

           <div className="ticket-content-grid">
             <div className="ticket-message-card">
               <div className="ticket-field">
                 <label>Subject</label>
                 <input type="text" value={selectedTicket.subject || ""} readOnly />
               </div>

               <div className="ticket-field">
                 <label>Message</label>
                 <textarea value={selectedTicket.message || ""} readOnly rows={8} />
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
                   <span className="ticket-message saved">{savedMessage}</span>
                 )}
               </div>
             </div>
           </div>

           <div className="ticket-order-card">
             <h3>Order</h3>

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
                 {selectedTicket?.orderItems?.map((item, index) => (
                   <tr key={index}>
                     <td className="product-cell">
                       <img src={item.image || rose} alt={item.name} />
                       {item.name}
                     </td>
                     <td>{item.price}</td>
                     <td>{item.qty}</td>
                     <td>{item.price}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>

         </div>
       </div>
     </div>
   </div>
 );
}

export default TicketManagement;