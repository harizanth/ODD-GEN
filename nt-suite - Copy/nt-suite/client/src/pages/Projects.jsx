import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  CheckSquare, Plus, Clock, User, AlertCircle, Calendar,
  CheckCircle, ChevronRight
} from 'lucide-react';

const STAGES = [
  { id: 'todo', label: 'To Do', color: '#64748B' },
  { id: 'inprogress', label: 'In Progress', color: '#E67E22' },
  { id: 'done', label: 'Done', color: '#28A745' }
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [newProjModal, setNewProjModal] = useState(false);

  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('normal');
  const [assigneeId, setAssigneeId] = useState('');
  const [projName, setProjName] = useState('');

  const loadData = () => {
    Promise.all([
      api.get('/projects'),
      api.get('/hr/employees')
    ]).then(([projRes, empRes]) => {
      setProjects(projRes || []);
      setUsers(empRes || []);
      if (projRes && projRes.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projRes[0].id);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadTasks = (projId) => {
    if (!projId) return;
    api.get(`/projects/${projId}/tasks`).then((res) => {
      setTasks(res || []);
    });
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadTasks(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle || !selectedProjectId) return;
    try {
      await api.post(`/projects/${selectedProjectId}/tasks`, {
        title: taskTitle,
        priority: taskPriority,
        assigneeId: assigneeId ? Number(assigneeId) : null
      });
      setNewTaskModal(false);
      setTaskTitle('');
      loadTasks(selectedProjectId);
    } catch (err) {
      alert('Error creating task: ' + err.message);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projName) return;
    try {
      const p = await api.post('/projects', { name: projName });
      setNewProjModal(false);
      setProjName('');
      loadData();
      setSelectedProjectId(p.id);
    } catch (err) {
      alert('Error creating project: ' + err.message);
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      await api.put(`/projects/tasks/${taskId}`, { status: newStatus });
      loadTasks(selectedProjectId);
    } catch (err) {
      alert('Error moving task: ' + err.message);
    }
  };

  const selectedProj = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="text-[#875A7B]" /> Projects & Task Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Organize team tasks with Kanban boards, sprint tracking, and real-time workload delegation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewProjModal(true)}
            className="o-btn o-btn-teal flex items-center gap-1.5"
          >
            <Plus size={16} /> New Project
          </button>
          <button
            onClick={() => setNewTaskModal(true)}
            className="o-btn o-btn-primary flex items-center gap-1.5"
          >
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Project Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {projects.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedProjectId(p.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedProjectId === p.id
                ? 'bg-[#714B67] text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Task Kanban Columns */}
      <div className="o-kanban">
        {STAGES.map((stg) => {
          const stageTasks = tasks.filter(t => t.status === stg.id);
          return (
            <div key={stg.id} className="o-kanban-col">
              <div className="o-kanban-col-header" style={{ borderLeft: `3px solid ${stg.color}` }}>
                <span>{stg.label}</span>
                <span className="count">{stageTasks.length}</span>
              </div>

              <div className="space-y-2.5 flex-1">
                {stageTasks.map((t) => (
                  <div key={t.id} className="o-kanban-card space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-2">
                        {t.title}
                      </h4>
                      <span className={`o-badge ${t.priority === 'high' ? 'o-badge-danger' : 'o-badge-muted'}`}>
                        {t.priority}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <User size={12} className="text-[#017E84]" />
                      <span>{t.assignee?.name || 'Unassigned'}</span>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px]">
                      <select
                        value={t.status}
                        onChange={(e) => handleMoveTask(t.id, e.target.value)}
                        className="text-[11px] bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5"
                      >
                        {STAGES.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {newTaskModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="o-modal-header">
              <span>Create Task in {selectedProj?.name}</span>
              <button onClick={() => setNewTaskModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Task Title:</label>
                  <input
                    required
                    placeholder="e.g. Audit security logs"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>

                <div className="o-field">
                  <label>Priority:</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="o-field">
                  <label>Assignee:</label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    <option value="">-- Unassigned --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.userId || u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewTaskModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {newProjModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="o-modal-header">
              <span>Create New Project</span>
              <button onClick={() => setNewProjModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Project Name:</label>
                  <input
                    required
                    placeholder="e.g. Q4 Website Relaunch"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                  />
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewProjModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-teal">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
