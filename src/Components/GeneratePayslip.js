import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import EmployeeService from "../services/EmployeeService";
import "./GeneratePayslip.css"; // create this css file
import { FaMoneyBillWave, FaFileInvoiceDollar, FaCheckCircle } from "react-icons/fa";

const GeneratePayslip = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    employeeId: "",
    month: "",
    year: "",
    basicSalary: "",
    allowances: 0,
    overtimePay: 0,
    bonus: 0,
    deductions: 0,
    unpaidLeaveDeduction: 0,
    tax: 0
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await EmployeeService.getEmployees();
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCalculate = () => {
    const earnings =
      Number(form.basicSalary) +
      Number(form.allowances) +
      Number(form.overtimePay) +
      Number(form.bonus);

    const deductions =
      Number(form.deductions) +
      Number(form.unpaidLeaveDeduction) +
      Number(form.tax);

    const netSalary = earnings - deductions;

    setPreview({ earnings, deductions, netSalary });
  };

  const handleConfirmGenerate = async () => {
    try {
      setLoading(true);
      await api.post("/payslips/generate", form);
      alert("Payslip generated successfully!");
      navigate("/admin/payslips");
    } catch (error) {
      alert("Error generating payslip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payslip-container">
      {/* <h2 className="page-title">Generate Payslip</h2> */}

        {/* Top Filter Section */}
        <div className="card filter-card filter-row">
            <label>Employee</label>
            <select name="employeeId" value={form.employeeId} onChange={handleChange}>
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                </option>
                ))}
            </select>

            <select name="month" value={form.month} onChange={handleChange}>
                <option value="">Month</option>
                {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                    {i + 1}
                </option>
                ))}
            </select>

            <input
                type="number"
                name="year"
                placeholder="Year"
                value={form.year}
                onChange={handleChange}
            />
        </div>

        {/* Earnings & Deductions */}
        <div className="card form-card flex-row">
            <div className="column">
                <h3>Earnings</h3>
                <div className="form-row">
                    <label>Basic Salary</label>
                    <input name="basicSalary" value={form.basicSalary} onChange={handleChange}/>
                </div>

                <div className="form-row">
                    <label>Allowances</label>
                    <input name="allowances" value={form.allowances} onChange={handleChange}/>
                </div>

                <div className="form-row">
                    <label>Overtime</label>
                    <input name="overtimePay" value={form.overtimePay} onChange={handleChange}/>
                </div>

                <div className="form-row">
                    <label>Bonus</label>
                    <input name="bonus" value={form.bonus} onChange={handleChange}/>
                </div>

                <button className="btn-calculate" onClick={handleCalculate}>
                    Calculate
                </button>
            </div>

            <div className="column">
                <h3>Deductions</h3>
                <div className="form-row">
                    <label>Deductions</label>
                    <input name="deductions" placeholder="Other Deductions" value={form.deductions} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Unpaid Leave Deductions</label>
                    <input name="unpaidLeaveDeduction" placeholder="Unpaid Leave" value={form.unpaidLeaveDeduction} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Tax</label>
                    <input name="tax" placeholder="Tax" value={form.tax} onChange={handleChange} />
                </div>
            </div>
        </div>

        {/* <div className="action-center">
            <button className="btn-calculate" onClick={handleCalculate}>
                Calculate
            </button>
        </div> */}

        {/* Preview Section */}
        {preview && (
            <div className="card preview-card">

                <div className="preview-wrapper">

                    {/* LEFT SIDE */}
                    <div className="preview-left">
                        <h3>Preview Payslip</h3>

                        <div className="preview-row">
                        <span className="icon earnings"><FaMoneyBillWave/></span>
                        <span>Total Earnings</span>
                        <strong>{preview.earnings}</strong>
                        </div>

                        <div className="preview-row">
                        <span className="icon deductions"><FaFileInvoiceDollar/></span>
                        <span>Total Deductions</span>
                        <strong>{preview.deductions}</strong>
                        </div>

                        <div className="preview-row net">
                        <span className="icon net"><FaCheckCircle/></span>
                        <span>Net Salary</span>
                        <strong>{preview.netSalary}</strong>
                        </div>

                        <button
                        className="btn-confirm"
                        onClick={handleConfirmGenerate}
                        disabled={loading}
                        >
                        {loading ? "Generating..." : "Confirm & Generate"}
                        </button>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="preview-right">
                        <div className="image-container">
                            <img src="/images/payslip-preview.jpg" alt="preview" className="preview-image"/>
                            <div className="overlay-text">
                                <p>Please preview the payslip details before confirming.</p>
                                <p>Click on <b>"Confirm & Generate"</b> to finalize the payslip.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default GeneratePayslip;
