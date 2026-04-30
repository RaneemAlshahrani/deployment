import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/bubble-logo.png";
import "../styles/faqTemplates.css";

function FAQTemplates() {
 const navigate = useNavigate();

const [faqs, setFaqs] = useState([]);
const [showAll, setShowAll] = useState(false);

const loadFaqs = async () => {
  const data = await fetch("http://localhost:5000/api/faqs")
    .then(res => res.json());
  setFaqs(data);
};

useEffect(() => {
  loadFaqs();
}, []);

 const [selectedFaqId, setSelectedFaqId] = useState(null);
 const [form, setForm] = useState({ question: "", answer: "" });

 const [showAddForm, setShowAddForm] = useState(false);
 const [showEditForm, setShowEditForm] = useState(false);
 const [message, setMessage] = useState("");

 // ✅ validation
 const isFormInvalid =
   !form.question.trim() || !form.answer.trim();

 const handleEdit = (faq) => {
   setSelectedFaqId(faq._id);
   setForm({
     question: faq.question,
     answer: faq.answer,
   });
   setShowEditForm(true);
   setShowAddForm(false);
   setMessage("");
 };

const handleDelete = async (id) => {
  await fetch(`http://localhost:5000/api/faqs/${id}`, {
    method: "DELETE",
  });

  await loadFaqs();
};

 const handleAddNew = () => {
   setSelectedFaqId(null);
   setForm({ question: "", answer: "" });
   setShowAddForm(true);
   setShowEditForm(false);
   setMessage("");
 };

const handleSaveEdit = async () => {
  if (isFormInvalid || !selectedFaqId) return;

  await fetch(`http://localhost:5000/api/faqs/${selectedFaqId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  await loadFaqs();
  setForm({ question: "", answer: "" }); 
  setShowEditForm(false); 
  setSelectedFaqId(null); 
};

 const handleAdd = async () => {
  if (isFormInvalid) return;

  await fetch("http://localhost:5000/api/faqs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  await loadFaqs();
  setForm({ question: "", answer: "" }); 
setShowAddForm(false); 
};
const visibleFaqs = showAll ? faqs : faqs.slice(0, 5);
 return (
   <div className="purple-page faq-page">
     <div className="faq-layout">
       {/* Sidebar */}
       <div className="cs-sidebar">
         <div className="cs-logo-card">
           <img src={logo} alt="Bubble Logo" />
         </div>

         <button onClick={() => navigate("/customer-service/tickets")}>
           Ticket Management
         </button>

         <button className="active">FAQ Templates</button>

         <div className="cs-spacer" />

         <button
           onClick={() => {
             localStorage.removeItem("currentUser");
             navigate("/");
           }}
         >
           Logout
         </button>
       </div>

       {/* Main */}
       <div className="faq-main">
         <div className="faq-list-panel">
           <h2>FAQs</h2>

           <div className="faq-list">
             {visibleFaqs.map((faq) => (
               <div key={faq._id} className="faq-list-item">
                 <div className="faq-list-text">
                   <p className="faq-question">{faq.question}</p>
                   <p className="faq-answer-preview">{faq.answer}</p>
                 </div>

                 <div className="faq-item-actions">
                   <button
                     className="faq-edit-btn"
                     onClick={() => handleEdit(faq)}
                   >
                     Edit
                   </button>

                   <button
                     className="faq-delete-btn"
                     onClick={() => {
                       if (
                         window.confirm(
                           "Are you sure you want to delete this FAQ?"
                         )
                       ) {
                         handleDelete(faq._id);
                       }
                     }}
                   >
                     Delete
                   </button>
                 </div>
               </div>
             ))}
             {faqs.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  marginTop: "10px",
                  background: "transparent",
                  border: "none",
                  color: "#7c3aed",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                {showAll ? "Show Less" : "View More"}
              </button>
            )}
           </div>

           <div className="faq-add-row">
             <button className="faq-add-btn" onClick={handleAddNew}>
               + Add FAQ Template
             </button>
           </div>

           {message === "Deleted!" && (
             <div className="faq-inline-message">{message}</div>
           )}
         </div>

         {/* Form */}
         {(showEditForm || showAddForm) && (
           <div className="faq-form-panel">
             <h3>{showEditForm ? "Edit FAQ" : "Add FAQ"}</h3>

             <div className="faq-field">
               <label>Question</label>
               <input
                 type="text"
                 value={form.question}
                 onChange={(e) =>
                   setForm({ ...form, question: e.target.value })
                 }
               />
             </div>

             <div className="faq-field">
               <label>Answer</label>
               <input
                 type="text"
                 value={form.answer}
                 onChange={(e) =>
                   setForm({ ...form, answer: e.target.value })
                 }
               />
             </div>

             <div className="faq-save-row">
               <button
                 className="faq-save-btn"
                 onClick={showEditForm ? handleSaveEdit : handleAdd}
                 disabled={isFormInvalid}
               >
                 {showEditForm ? "Save Changes" : "Add"}
               </button>

               {(message === "Saved!" || message === "Added!") && (
                 <span className="faq-message">{message}</span>
               )}
             </div>
           </div>
         )}
       </div>
     </div>
   </div>
 );
}

export default FAQTemplates;