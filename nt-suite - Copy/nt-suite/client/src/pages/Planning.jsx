import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  CalendarDays, Plus, Clock, User, CheckCircle, ChevronLeft,
  ChevronRight, Users, Briefcase
} from 'lucide-react';

export default function Planning() {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newShiftModal, setNewShiftModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('Support Engineer');
  const [userEmail, setUserEmail] = useState('');
  const [hours, setHours] = useState(8);
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = () => {
    Promise.all([
      api.get('/fieldservice/planning'),
      api.get('/hr/employees')
    ]).then(([shiftRes, empRes]) => {
      setShifts(shiftRes || []);
      setEmployees(empRes || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateShift = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const start = new Date(`${shiftDate}T09:00:00`);
      const end = new Date(`${shiftDate}T17:00:00`);

      await api.post('/fieldservice/planning', {
        title,
        role,
        userEmail,
        startTime: start,
        endTime: end,
        allocated: Number(hours),
        status: 'published'
      });

      setNewShiftModal(false);
      setTitle('');
      setUserEmail('');
      loadData();
    } catch (err) {
      alert('Error scheduling shift: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="text-[#017E84]" /> Planning & Shift Rostering
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Organize team shifts, allocate hourly workloads, and view weekly schedules
          </p>
        </div>

        <button
          onClick={() => setNewShiftModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> New Shift Assignment
        </button>
      </div>

      {/* Shift Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts.map((shift) => (
          <div key={shift.id} className="o-card border-l-4 border-l-[#017E84]">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/30 text-[#017E84] dark:text-teal-300">
                {shift.role}
              </span>
              <span className={`o-badge ${shift.status === 'published' ? 'o-badge-success' : 'o-badge-muted'}`}>
                {shift.status}
              </span>
            </div>

            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
              {shift.title}
            </h3>

            <div className="space-y-1 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1.5">
                <User size={13} className="text-[#714B67]" />
                <span>{shift.userEmail || 'Unassigned Staff'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-amber-500" />
                <span>
                  {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {new Date(shift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                  ({shift.allocated} hrs)
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 text-[11px] text-gray-400">
              Scheduled Date: {new Date(shift.startTime).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* New Shift Modal */}
      {newShiftModal && (
        <div className="o-modal-overlay">
          <div className="o-modal">
            <div className="o-modal-header">
              <span>Schedule Shift</span>
              <button onClick={() => setNewShiftModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateShift}>
              <div className="o-modal-body space-y-4">
                <div className="o-field">
                  <label>Shift Title:</label>
                  <input
                    required
                    placeholder="e.g. Afternoon Tier-2 Support"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Role / Function:</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Support Engineer">Support Engineer</option>
                      <option value="Sales Rep">Sales Rep</option>
                      <option value="Technician">Technician</option>
                      <option value="Operator">Operator</option>
                    </select>
                  </div>
                  <div className="o-field">
                    <label>Assignee (Employee):</label>
                    <select
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    >
                      <option value="">-- Choose Employee --</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.email}>{emp.name} ({emp.role})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Shift Date:</label>
                    <input
                      type="date"
                      required
                      value={shiftDate}
                      onChange={(e) => setShiftDate(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>Duration (Hours):</label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewShiftModal(false)} className="o-btn">
                  Cancel
                </button>
                <button type="submit" className="o-btn o-btn-primary">
                  Publish Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
