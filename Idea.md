# Project Idea Submission: PocketLedger

### **1. Project Title**
PocketLedger: AI-Powered Mobile Business Manager

### **2. Your Name & Roll Number**
SANDESH LENDVE - 2024-B-19022006A

### **3. Problem Statement**
Many small business owners, freelancers, and sole proprietors in India still rely on manual bookkeeping (pen and paper) or complex desktop accounting software like Tally. Manual methods are tedious, prone to human error, and offer no real-time financial insights. Desktop software, while powerful, has a steep learning curve, is often costly, and lacks the on-the-go accessibility required by modern, mobile-first business owners. There is a clear need for a simple, intuitive, and mobile-first solution to manage business finances effortlessly.

### **4. Proposed Solution / Idea**
**PocketLedger** is a mobile application for Android and iOS that simplifies daily financial management. The core concept is to provide a user-friendly interface for recording sales, expenses, and managing inventory directly from a smartphone. The standout feature will be an **AI-powered receipt scanner**. Users can simply take a photo of a bill or invoice, and the app will use Optical Character Recognition (OCR) to automatically extract key information like vendor name, amount, date, and items, creating a transaction entry with minimal manual input. All data will be securely stored in the cloud, offering real-time synchronization and backup.

### **5. Key Features**
* **AI-Powered Receipt Scanning:** Instantly digitize paper receipts and invoices using the phone's camera and OCR technology to auto-fill transaction details.
* **Income & Expense Tracking:** A simple interface to manually add, edit, and view all business transactions.
* **Real-time Financial Dashboard:** Visualize business health at a glance with simple charts showing profit & loss, cash flow, and spending categories.
* **GST-Ready Invoicing:** Create, customize, and send professional, GST-compliant invoices to clients via email or WhatsApp.
* **Secure Cloud Backup:** All financial data is automatically and securely backed up to the cloud, ensuring data safety and accessibility across devices.
* **Simplified Reporting:** Generate and export basic financial reports (e.g., sales report, expense report) in PDF format.

### **6. Target Users / Audience**
* Small Business Owners (Kirana stores, local shopkeepers, retailers)
* Freelancers (Designers, writers, developers, consultants)
* Home-Based Entrepreneurs (Individuals running businesses from home like bakers, artists, etc.)

### **7. Technology Stack**
* **Mobile Framework:** `React Native`
* **Backend:** `Node.js` with `Express.js`
* **Database:** `MongoDB` or `Firebase Firestore`
* **AI/ML:** `Google's ML Kit (Text Recognition API)`
* **Authentication & Cloud:** `Firebase Authentication` and `Firebase Cloud Storage`
* **Deployment:** `Vercel`, or `Google Cloud Platform (GCP)`

### **8. Expected Outcome**
The final output will be a fully functional mobile application that allows a user to manage their daily business finances seamlessly. The AI-powered receipt scanning should achieve over **95% accuracy** on standard printed receipts, and a user should be able to log a new transaction in **under 20 seconds**. The app will provide clear, actionable insights through its dashboard, empowering the user to make better financial decisions.

### **9. Timeline (Optional)**
* **Week 1–2:** In-depth research, finalize features, and design the UI/UX using Figma.
* **Week 3–4:** Set up the backend server, database schema, and user authentication APIs.
* **Week 5–7:** Develop the core frontend application using Flutter/React Native.
* **Week 8–9:** Integrate the AI/ML model (ML Kit) for the receipt scanning feature.
* **Week 10:** Develop the dashboard and reporting functionalities.
* **Week 11–12:** Conduct thorough testing, fix bugs, and prepare for deployment.

### **10. Additional Notes**
* **Key Challenge:** The primary challenge will be handling the variability in receipt formats, fonts, and conditions (e.g., crumpled or faded receipts) to ensure high OCR accuracy.
* **Future Scope:** The project can be extended to include inventory management, integration with payment gateways (like Razorpay or Stripe), and advanced predictive analytics for financial forecasting.