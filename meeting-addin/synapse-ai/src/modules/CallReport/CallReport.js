import React , { useState,useEffect } from "react";
import Select from "react-select";
import { fetchActionDetails } from '../../services/meetingService';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const assigneesList = [
    { value: "ajay", label: "Ajay Kumar" },
    { value: "rahul", label: "Rahul Sharma" },
    { value: "sneha", label: "Sneha Verma" },
    { value: "rohit", label: "Rohit Mehta" },
  ];

const CallReport = ({ onGoBack , eventInfo }) => {

    const [formData, setFormData] = useState({
        client: eventInfo.accounts?.map(account => account.label).join(", ") || "N/A",
        task: "", //action item
        assignor: "Ajay Kumar Gaur",
        assignee: "",
        assignByMe: false,
        dueDate: "2025-01-08",
        status: "Open",
        topic: "Supercharge",
        subTopic: "",
        comments: "",
        summary:""
      });

      useEffect(()=>{

        const fetchActionData = async () => {

        const actionItems = await fetchActionDetails(eventInfo.outlookItemId);
        setFormData({ ...formData, task: actionItems?.description || "" ,summary:actionItems?.summary || "" });

        };

        fetchActionData();

      },[])
    
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
          ...formData,
          [name]: type === "checkbox" ? checked : value,
        });
      };

      const handleAssigneeChange = (selectedOption) => {
        setFormData({ ...formData, assignee: selectedOption });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
      };

      const generatePDF = () => {
        const doc = new jsPDF();

        // Main Heading
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Call Report", 20, 10);
        
        // Subheading
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(100); // Gray color
        doc.text(`Title : ${eventInfo.meetingTitle}`, 20, 18);

        // Table data
        const tableData = Object.entries(formData).map(([key, value]) => [key, value]);

        autoTable(doc, {
            head: [["Item", "Description"]],
            body: tableData,
            startY: 20,
        });

        const fileName = `CallReport_${eventInfo.meetingTitle}.pdf`;
        doc.save(fileName);
    };
  
  return (
    <div >      
      <button className="btn btn-secondary mt-3" onClick={onGoBack}>
        Go Back
      </button>

      <div className="container mt-3">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Call Report</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Client */}
            <div className="mb-3">
              <label className="form-label">Client *</label>
              <input
                type="text"
                className="form-control"
                value={formData.client}
                readOnly
              />
            </div>

            {/* Action Item Task */}
            <div className="mb-3">
              <label className="form-label">Action Item Task *</label>
              <textarea
                type="text"
                className="form-control"
                name="task"
                rows="3"
                value={formData.task}
                onChange={handleChange}
                required
              />
            </div>

            {/* Assignor & Assignee */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Assignor *</label>
                <input type="text" className="form-control" value={formData.assignor} readOnly />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Assignee *</label>
                <Select
                    options={assigneesList}
                    value={formData.assignee}
                    onChange={handleAssigneeChange}
                    placeholder="Search by name"
                    isSearchable
                />
              </div>
            </div>

            {/* Assign by me Checkbox */}
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="assignByMe"
                checked={formData.assignByMe}
                onChange={handleChange}
              />
              <label className="form-check-label">Assign by me</label>
            </div>

            {/* Due Date */}
            <div className="mb-3">
              <label className="form-label">Due Date *</label>
              <input
                type="date"
                className="form-control"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Status Radio Buttons */}
            <div className="mb-3">
              <label className="form-label">Status *</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="status"
                    value="Open"
                    checked={formData.status === "Open"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Open</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="status"
                    value="Complete"
                    checked={formData.status === "Complete"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Complete</label>
                </div>
              </div>
            </div>

            {/* Topic & Sub Topic */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Topic *</label>
                <select className="form-select" name="topic" value={formData.topic} onChange={handleChange} required>
                  <option>Supercharge</option>
                  <option>Optimization</option>
                  <option>Performance</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Sub Topic(s)</label>
                <select className="form-select" name="subTopic" value={formData.subTopic} onChange={handleChange}>
                  <option value="">Select Sub Topic</option>
                  <option>Analysis</option>
                  <option>Improvements</option>
                </select>
              </div>
            </div>

            {/* Comments */}
            <div className="mb-3">
              <label className="form-label">Comments</label>
              <textarea
                className="form-control"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
              />
            </div>

            {/* Summary */}
            <div className="mb-3">
              <label className="form-label">Summary</label>
              <textarea
                className="form-control"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end gap-3">
              <button type="submit" className="btn btn-primary">Save</button>
              <button className="btn btn-primary" onClick={generatePDF}>Download</button>
              <button type="button" className="btn btn-secondary" onClick={onGoBack}>Cancel</button>              
            </div>
          </form>
        </div>
      </div>
    </div>

    </div>
  );
};

export default CallReport;
