import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  Users, Plus, Mail, Building, CheckCircle, Clock,
  Calendar, Briefcase, UserCheck
} from 'lucide-react';

export default function HR() {
  const [tab, setTab] = useState('employees'); // 'employees' | 'leaves'
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmpModal, setNewEmpModal] = useState(false);
  const [newLeaveModal, setNewLeaveModal] = useState(false);

  // Form states
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [deptId, setDeptId] = useState('');

  // Leave form states
  const [leaveEmpId, setLeaveEmpId] = useState('');
  const [leaveType, setLeaveType] = useState('annual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = () => {
    Promise.all([
      api.get('/hr/employees'),
      api.get('/hr/departments'),
      api.get('/hr/leaves')
    ]).then(([empRes, deptRes, leaveRes]) => {
      setEmployees(empRes || []);
      setDepartments(deptRes || []);
      setLeaves(leaveRes || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!empName || !empRole) return;
    try {
      await api.post('/hr/employees', {
        name: empName,
        role: empRole,
        email: empEmail,
        departmentId: deptId ? Number(deptId) : null
      });
      setNewEmpModal(false);
      setEmpName('');
      setEmpRole('');
      setEmpEmail('');
      loadData();
    } catch (err) {
      alert('Error adding employee: ' + err.message);
    }
  };

  const handleCreateLeave = async (e) => {
    e.preventDefault();
    if (!leaveEmpId) return;
    try {
      await api.post('/hr/leaves', {
        employeeId: Number(leaveEmpId),
        type: leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      });
      setNewLeaveModal(false);
      loadData();
    } catch (err) {
      alert('Error requesting leave: ' + err.message);
    }
  };

  const handleUpdateLeaveStatus = async (leaveId, status) => {
    try {
      await api.put(`/hr/leaves/${leaveId}`, { status });
      loadData();
    } catch (err) {
      alert('Error updating leave: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="text-[#27AE60]" /> Human Resources & Team Directory
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage organizational roster, departmental roles, and employee time-off requests
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tab === 'employees' ? (
            <button
              onClick={() => setNewEmpModal(true)}
              className="o-btn o-btn-primary flex items-center gap-1.5"
            >
              <Plus size={16} /> Add Employee
            </button>
          ) : (
            <button
              onClick={() => setNewLeaveModal(true)}
              className="o-btn o-btn-primary flex items-center gap-1.5"
            >
              <Plus size={16} /> Request Time Off
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="o-tabs">
        <button
          onClick={() => setTab('employees')}
          className={`o-tab ${tab === 'employees' ? 'active' : ''}`}
        >
          Team Members ({employees.length})
        </button>
        <button
          onClick={() => setTab('leaves')}
          className={`o-tab ${tab === 'leaves' ? 'active' : ''}`}
        >
          Time Off & Leaves ({leaves.length})
        </button>
      </div>

      {/* Employee Cards Grid */}
      {tab === 'employees' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {employees.map((emp) => (
            <div key={emp.id} className="o-card flex flex-col items-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#714B67] text-white font-bold text-lg flex items-center justify-center shadow-md">
                {emp.name.charAt(0)}
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">{emp.name}</h3>
                <p className="text-xs text-[#017E84] font-medium">{emp.role}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{emp.department?.name || 'General'}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 w-full flex justify-between items-center text-xs">
                <span className={`o-badge ${emp.status === 'leave' ? 'o-badge-warning' : 'o-badge-success'}`}>
                  {emp.status === 'leave' ? 'On Leave' : 'Active'}
                </span>
                <span className="text-[11px] text-gray-400">{emp.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaves Table */}
      {tab === 'leaves' && (
        <div className="o-table-wrap">
          <table className="o-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Approval Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No time off requests recorded.
                  </td>
                </tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id}>
                    <td className="font-semibold text-gray-900 dark:text-white">
                      {l.employee?.name}
                    </td>
                    <td>
                      <span className="o-badge o-badge-teal uppercase">{l.type}</span>
                    </td>
                    <td className="text-xs text-gray-500">
                      {new Date(l.startDate).toLocaleDateString()}
                    </td>
                    <td className="text-xs text-gray-500">
                      {new Date(l.endDate).toLocaleDateString()}
                    </td>
                    <td>
                      {l.status === 'approved' && <span className="o-badge o-badge-success">Approved</span>}
                      {l.status === 'pending' && <span className="o-badge o-badge-warning">Pending Approval</span>}
                      {l.status === 'rejected' && <span className="o-badge o-badge-danger">Rejected</span>}
                    </td>
                    <td>
                      {l.status === 'pending' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateLeaveStatus(l.id, 'approved')}
                            className="o-btn o-btn-sm o-btn-success"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateLeaveStatus(l.id, 'rejected')}
                            className="o-btn o-btn-sm o-btn-danger"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* New Employee Modal */}
      {newEmpModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="o-modal-header">
              <span>Add Employee</span>
              <button onClick={() => setNewEmpModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateEmployee}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Full Name:</label>
                  <input
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                  />
                </div>

                <div className="o-field">
                  <label>Role / Designation:</label>
                  <input
                    required
                    placeholder="e.g. Sales Specialist"
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                  />
                </div>

                <div className="o-field">
                  <label>Email Address:</label>
                  <input
                    type="email"
                    placeholder="eleanor@company.com"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                  />
                </div>

                <div className="o-field">
                  <label>Department:</label>
                  <select
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewEmpModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Leave Request Modal */}
      {newLeaveModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="o-modal-header">
              <span>Request Time Off</span>
              <button onClick={() => setNewLeaveModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateLeave}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Employee:</label>
                  <select
                    required
                    value={leaveEmpId}
                    onChange={(e) => setLeaveEmpId(e.target.value)}
                  >
                    <option value="">-- Choose Employee --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="o-field">
                  <label>Leave Type:</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                  >
                    <option value="annual">Annual Paid Vacation</option>
                    <option value="sick">Sick Leave</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Start Date:</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>End Date:</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewLeaveModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
