import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Input from "../components/Input";

function Contact() {

 const [form, setForm] = useState({
   fullName: "",
   orderId: "",
   email: "",
   phone: "",
   subject: "",
   message: "",
 });

 const [errors, setErrors] = useState({});
 const [successMessage, setSuccessMessage] = useState("");
const [showAll, setShowAll] = useState(false);
 const [faqs, setFaqs] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/faqs")
    .then(res => res.json())
    .then(data => setFaqs(data));
}, []);

 const isLoggedIn = true;
 const isMobile = window.innerWidth <= 768;

 const handleChange = (e) => {
   const { name, value } = e.target;

   setForm((prev) => ({
     ...prev,
     [name]: value,
   }));

   setErrors((prev) => ({
     ...prev,
     [name]: "",
     login: "",
   }));

   setSuccessMessage("");
 };

 const validateForm = () => {
   const newErrors = {};

   if (!isLoggedIn) {
     newErrors.login = "Please log in to submit a ticket";
   }

   if (!form.fullName.trim()) {
     newErrors.fullName = "Name is required";
   } else if (/\d/.test(form.fullName)) {
     newErrors.fullName = "Name cannot contain numbers";
   }

   if (!form.email.trim()) {
     newErrors.email = "Email is required";
   } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
     newErrors.email = "Invalid email format";
   }

   if (form.phone && !/^\d+$/.test(form.phone)) {
     newErrors.phone = "Phone must contain only numbers";
   }

   if (form.orderId && !/^\d+$/.test(form.orderId)) {
     newErrors.orderId = "Order ID must be numbers only";
   }

   if (!form.subject.trim()) {
     newErrors.subject = "Subject cannot be empty";
   }

   if (!form.message.trim()) {
     newErrors.message = "Message cannot be empty";
   }

   return newErrors;
 };

const handleSubmit = async () => {
  const newErrors = validateForm();
  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    setSuccessMessage("");
    return;
  }

  const newTicket = {
    customer: form.fullName,
    email: form.email,
    phone: form.phone,
    orderNumber: form.orderId || "N/A",
    amount: "-",
    status: "Pending",
    date: new Date().toLocaleDateString(),
    issueType: form.subject,
    refundEligibility: "Pending",
    subject: form.subject,
    message: form.message,
    orderItems: [],
  };

  await fetch("http://localhost:5000/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTicket),
  });

  setSuccessMessage("Support ticket submitted successfully");

  // ✅ تفريغ الفورم
  setForm({
    fullName: "",
    orderId: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
};
const visibleFaqs = showAll ? faqs : faqs.slice(0, 5);
 return (
   <div className="purple-page" style={{ minHeight: "100vh" }}>
     <div
       style={{
         position: "relative",
         zIndex: 2,
         paddingTop: isMobile ? "90px" : "95px",
         width: isMobile ? "94%" : "92%",
         maxWidth: "1200px",
         margin: "0 auto",
         paddingBottom: "40px",
       }}
     >
       <Navbar />

       <div
         style={{
           display: "flex",
           flexDirection: isMobile ? "column" : "row",
           gap: "16px",
           marginTop: "30px",
         }}
       >
         <div
           style={{
             width: isMobile ? "100%" : "32%",
             minHeight: isMobile ? "auto" : "500px",
             background: "rgba(255,255,255,0.12)",
             border: "1px solid rgba(255,255,255,0.25)",
             borderRadius: "28px",
             padding: isMobile ? "20px 16px" : "24px 20px",
             backdropFilter: "blur(14px)",
             boxSizing: "border-box",
           }}
         >
           <h2
             style={{
               marginTop: 0,
               marginBottom: isMobile ? "18px" : "24px",
               fontSize: isMobile ? "26px" : "32px",
               fontWeight: "600",
               color: "#2f2f2f",
             }}
           >
             FAQs
           </h2>

           {faqs.length > 0 ? (
  <>
    {visibleFaqs.map((faq) => (
      <div key={faq._id} style={{ marginBottom: "20px" }}>
        <p
          style={{
            margin: 0,
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "500",
            color: "#2f2f2f",
            lineHeight: 1.35,
          }}
        >
          {faq.question}
        </p>

        <p
          style={{
            marginTop: "6px",
            marginBottom: 0,
            fontSize: isMobile ? "14px" : "16px",
            color: "#666",
          }}
        >
          {faq.answer}
        </p>
      </div>
    ))}

    {/* ✅ Show More button */}
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
        {showAll ? "Show Less" : "Show More"}
      </button>
    )}
  </>
            ) : (
              <p>No FAQs available</p>
            )}
         </div>

         <div
           style={{
             flex: 1,
             width: "100%",
             minHeight: "500px",
             background: "rgba(255,255,255,0.12)",
             border: "1px solid rgba(255,255,255,0.25)",
             borderRadius: "28px",
             padding: isMobile ? "20px 16px" : "22px 20px",
             backdropFilter: "blur(14px)",
             boxSizing: "border-box",
           }}
         >
           <h1
             style={{
               marginTop: 0,
               marginBottom: "12px",
               fontSize: isMobile ? "28px" : "32px",
               fontWeight: "600",
               color: "#2f2f2f",
             }}
           >
             Contact Us
           </h1>

           {errors.login && (
             <p style={{ color: "#ff5a45" }}>{errors.login}</p>
           )}

           <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
           <Input label="Order Number" name="orderId" value={form.orderId} onChange={handleChange} error={errors.orderId} />
           <Input label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
           <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
           <Input label="Subject" name="subject" value={form.subject} onChange={handleChange} error={errors.subject} />
           <Input label="Message" name="message" value={form.message} onChange={handleChange} error={errors.message} textarea />

           <Button text="Submit" variant="purple" onClick={handleSubmit} />

           {successMessage && (
             <p style={{ color: "#39a86f" }}>{successMessage}</p>
           )}
         </div>
       </div>
     </div>
   </div>
 );
}

export default Contact;