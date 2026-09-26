import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  Clock, Play, Square, Plus, CheckCircle, Calendar,
  User, Layers, Trash2
} from 'lucide-react';

export default function Timesheets() {
  const [timesheets, setTimesheets] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLogModal, setNewLogModal] = useState(false);

  // Live Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTask, setTimerTask] = useState('');
  const [timerNote, setTimerNote] = useState('');

  // Form states
  const [taskId, setTaskId] = useState('');
  const [hours, setHours] = useState('');
  const [note, setNote] = useState('');

  const loadData = () => {
    Promise.all([
      api.get('/timesheets'),
      api.get('/projects')
    ]).then(([timeRes, projRes]) => {
      setTimesheets(timeRes || []);
      // Flatten tasks from projects
      const allTasks = [];
      (projRes || []).forEach(p => {
        if (p.tasks) {
          p.tasks.forEach(t => allTasks.push({ ...t, projName: p.name }));
        }
      });
      setTasks(allTasks);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else if (!isTimerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleStopTimer = async () => {
    setIsTimerRunning(false);
    const loggedHours = Math.max(0.1, +(timerSeconds / 3600).toFixed(2));
    try {
      await api.post('/timesheets', {
        taskId: timerTask ? Number(timerTask) : null,
        hours: loggedHours,
        note: timerNote || 'Live timer logged work session'
      });
      setTimerSeconds(0);
      setTimerNote('');
      loadData();
    } catch (err) {
      alert('Error saving timesheet: ' + err.message);
    }
  };

  const handleManualLog = async (e) => {
    e.preventDefault();
    if (!hours) return;
    try {
      await api.post('/timesheets', {
        taskId: taskId ? Number(taskId) : null,
        hours: Number(hours),
        note
      });
      setNewLogModal(false);
      setHours('');
      setNote('');
      loadData();
    } catch (err) {
      alert('Error logging timesheet: ' + err.message);
    }
  };

  const formatTimer = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalHours = timesheets.reduce((s, t) => s + (t.hours || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="text-[#3498DB]" /> Timesheet & Hourly Time Tracking
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Total Logged Hours: <strong className="text-gray-900 dark:text-white">{totalHours.toFixed(1)} hrs</strong>
          </p>
        </div>

        <button
          onClick={() => setNewLogModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> Log Hours Manually
        </button>
      </div>

      {/* Live Stopwatch Timer Widget */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-blue-400">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-xs text-blue-200 uppercase font-semibold tracking-wider">Live Time Tracker</div>
            <div className="text-2xl font-mono font-bold tracking-tight">{formatTimer(timerSeconds)}</div>
          </div>
        </div>

        <div className="flex flex-1 max-w-md items-center gap-2">
          <input
            type="text"
            placeholder="What are you working on right now?"
            value={timerNote}
            onChange={(e) => setTimerNote(e.target.value)}
            disabled={isTimerRunning}
            className="flex-1 bg-white/10 text-white placeholder-blue-200/50 text-xs px-3 py-2 rounded-lg border border-white/20 focus:outline-none"
          />

          {!isTimerRunning ? (
            <button
              onClick={() => setIsTimerRunning(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Play size={14} /> Start Timer
            </button>
          ) : (
            <button
              onClick={handleStopTimer}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Square size={14} /> Stop & Record
            </button>
          )}
        </div>
      </div>

      {/* Timesheets Ledger Table */}
      <div className="o-table-wrap">
        <table className="o-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Task / Project</th>
              <th>Logged Note</th>
              <th>Hours Tracked</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No timesheet records found. Use the timer or click "Log Hours Manually".
                </td>
              </tr>
            ) : (
              timesheets.map((ts) => (
                <tr key={ts.id}>
                  <td className="text-xs text-gray-500">
                    {new Date(ts.date).toLocaleDateString()}
                  </td>
                  <td className="font-semibold text-gray-900 dark:text-white">
                    {ts.user?.name || 'Teammate'}
                  </td>
                  <td>
                    <span className="o-badge o-badge-teal">
                      {ts.task?.title || 'General Activity'}
                    </span>
                  </td>
                  <td className="text-xs text-gray-600 dark:text-gray-300">
                    {ts.note || '—'}
                  </td>
                  <td className="font-bold text-[#714B67] dark:text-purple-400">
                    {ts.hours} hrs
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Log Modal */}
      {newLogModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="o-modal-header">
              <span>Log Timesheet Hours</span>
              <button onClick={() => setNewLogModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleManualLog}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Logged Hours:</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    required
                    placeholder="e.g. 2.5"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>

                <div className="o-field">
                  <label>Work Note / Description:</label>
                  <textarea
                    rows={3}
                    placeholder="What did you work on?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewLogModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Save Timesheet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
