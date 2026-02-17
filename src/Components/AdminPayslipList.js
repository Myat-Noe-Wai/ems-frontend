import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminPayslipList = () => {

  const [payslips, setPayslips] = useState([]);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    const res = await api.get("/payslips");
    setPayslips(res.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`/payslips/${id}`);
    fetchPayslips();
  };

  const exportPDF = (p) => {
    const doc = new jsPDF();
  
    // ===== HEADER =====
    doc.setFontSize(18);
    doc.text("Company Name Ltd.", 105, 15, { align: "center" });
  
    doc.setFontSize(12);
    doc.text("Employee Payslip", 105, 22, { align: "center" });
  
    doc.setLineWidth(0.5);
    doc.line(14, 26, 196, 26);
  
    // ===== EMPLOYEE INFO =====
    doc.setFontSize(11);
    doc.text(`Employee: ${p.employee.firstName} ${p.employee.lastName}`, 14, 35);
    doc.text(`Month: ${p.month}`, 14, 42);
    doc.text(`Year: ${p.year}`, 14, 49);
  
    // ===== EARNINGS =====
    autoTable(doc, {
      startY: 60,
      head: [["Earnings", "Amount"]],
      body: [
        ["Basic Salary", p.basicSalary],
        ["Allowances", p.allowances],
        ["Overtime", p.overtimePay],
        ["Bonus", p.bonus]
      ],
      theme: "grid"
    });
  
    // ===== DEDUCTIONS =====
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Deductions", "Amount"]],
      body: [
        ["Tax", p.tax],
        ["Leave Deduction", p.unpaidLeaveDeduction],
        ["Other", p.deductions]
      ],
      theme: "grid"
    });
  
    // ===== NET SALARY =====
    doc.setFontSize(14);
    doc.text(
      `Net Salary: ${p.netSalary.toLocaleString()} MMK`,
      196,
      doc.lastAutoTable.finalY + 20,
      { align: "right" }
    );
  
    doc.save(`Payslip_${p.month}_${p.year}.pdf`);
  };  

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Payslip History</h3>
  
      <div className="card shadow">
        <div className="card-body p-0">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-primary">
              <tr>
                <th>Employee</th>
                <th>Month</th>
                <th>Year</th>
                <th className="text-end">Net Salary</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
  
            <tbody>
              {payslips.map(p => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.employee.firstName} {p.employee.lastName}</strong>
                  </td>
  
                  <td>{p.month}</td>
                  <td>{p.year}</td>
  
                  <td className="text-end">
                      {p.netSalary.toLocaleString()} MMK
                  </td>
  
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary mr-2"
                      onClick={() => exportPDF(p)}
                    >
                      Download PDF
                    </button>
  
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );  
};

export default AdminPayslipList;
