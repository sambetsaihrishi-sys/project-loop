import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";

function FeedbackPage() {
  const token = localStorage.getItem("loop_token");

  const [feedback, setFeedback] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    channel: "Manual",
    content: "",
  });

  const [message, setMessage] = useState("");

  // CSV Import
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");

  const loadFeedback = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/feedback/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedback(response.data);
    } catch (error) {
      console.error("Unable to load feedback:", error);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/feedback/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Feedback added successfully");

      setFormData({
        customer_name: "",
        customer_email: "",
        channel: "Manual",
        content: "",
      });

      await loadFeedback();
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Unable to add feedback"
      );
    }
  };

  // CSV IMPORT
  const handleCSVImport = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setImportMessage("Please select a CSV file.");
      event.target.value = "";
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setImporting(true);
      setImportMessage("");

      const response = await axios.post(
        `${API_URL}/feedback/import-csv`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setImportMessage(
        `${response.data.imported} feedback records imported successfully.`
      );

      await loadFeedback();
    } catch (error) {
      console.error("CSV import failed:", error);

      setImportMessage(
        error.response?.data?.detail ||
          "Unable to import CSV."
      );
    } finally {
      setImporting(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <section className="feedback-page">
      <div className="feedback-header">
        <div>
          <p className="eyebrow">CUSTOMER FEEDBACK</p>

          <h1>Feedback Management</h1>

          <p className="subtitle">
            Add, import, analyze and review customer feedback.
          </p>
        </div>

        {/* CSV IMPORT BUTTON */}
        <div className="feedback-actions">
          <button
            type="button"
            className="import-btn"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={importing}
          >
            {importing
              ? "Importing..."
              : "Import CSV"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleCSVImport}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {importMessage && (
        <p className="import-message">
          {importMessage}
        </p>
      )}

      <div className="feedback-layout">
        {/* ADD FEEDBACK */}
        <div className="panel feedback-form-card">
          <h2>Add Feedback</h2>

          <form onSubmit={handleSubmit}>
            <label>Customer Name</label>

            <input
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Customer name"
            />

            <label>Customer Email</label>

            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              placeholder="customer@example.com"
            />

            <label>Channel</label>

            <select
              name="channel"
              value={formData.channel}
              onChange={handleChange}
            >
              <option>Manual</option>
              <option>Support</option>
              <option>Survey</option>
              <option>App Review</option>
              <option>Email</option>
              <option>Social Media</option>
            </select>

            <label>Feedback</label>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter customer feedback..."
              required
            />

            <button
              className="primary-btn"
              type="submit"
            >
              Analyze & Add Feedback
            </button>

            {message && (
              <p className="feedback-message">
                {message}
              </p>
            )}
          </form>
        </div>

        {/* FEEDBACK TABLE */}
        <div className="panel feedback-table-card">
          <div className="panel-heading">
            <div>
              <h2>Recent Feedback</h2>

              <p>
                {feedback.length} feedback records
              </p>
            </div>
          </div>

          <div className="feedback-table-wrapper">
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Channel</th>
                  <th>Feedback</th>
                  <th>Sentiment</th>
                  <th>Theme</th>
                </tr>
              </thead>

              <tbody>
                {feedback.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      No feedback available.
                    </td>
                  </tr>
                ) : (
                  feedback.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>
                          {item.customer_name ||
                            "Anonymous"}
                        </strong>

                        <span>
                          {item.customer_email}
                        </span>
                      </td>

                      <td>{item.channel}</td>

                      <td className="feedback-content">
                        {item.content}
                      </td>

                      <td>
                        <span
                          className={`sentiment-badge ${
                            item.sentiment?.toLowerCase() ||
                            ""
                          }`}
                        >
                          {item.sentiment ||
                            "Pending"}
                        </span>
                      </td>

                      <td>
                        {item.theme || "General"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeedbackPage;