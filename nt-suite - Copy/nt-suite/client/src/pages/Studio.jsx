import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  Wrench, Plus, Database, Table, Sliders, CheckCircle,
  Code, Shield, Layers, Layout
} from 'lucide-react';

export default function Studio() {
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFieldModal, setNewFieldModal] = useState(false);

  // Form states
  const [modelName, setModelName] = useState('Partner');
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('char');
  const [label, setLabel] = useState('');

  const loadData = () => {
    api.get('/studio/fields').then((res) => {
      setCustomFields(res || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateField = async (e) => {
    e.preventDefault();
    if (!fieldName || !label) return;
    try {
      await api.post('/studio/fields', {
        modelName,
        fieldName: fieldName.startsWith('x_') ? fieldName : `x_${fieldName}`,
        fieldType,
        label
      });
      setNewFieldModal(false);
      setFieldName('');
      setLabel('');
      loadData();
    } catch (err) {
      alert('Error creating custom field: ' + err.message);
    }
  };

  const MODELS = ['Partner', 'Lead', 'SalesOrder', 'Invoice', 'Product', 'Task', 'Employee'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wrench className="text-[#714B67]" /> Odoo Studio Customizer
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Add custom schema fields, extend business objects on the fly, and customize data views
          </p>
        </div>

        <button
          onClick={() => setNewFieldModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> Add Custom Field
        </button>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODELS.map((model) => {
          const fields = customFields.filter(f => f.modelName === model);
          return (
            <div key={model} className="o-card space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-[#017E84]" />
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">{model}</h3>
                </div>
                <span className="o-badge o-badge-teal">{fields.length} Custom Fields</span>
              </div>

              <div className="space-y-2 min-h-[80px]">
                {fields.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-2">No custom fields defined</p>
                ) : (
                  fields.map(f => (
                    <div key={f.id} className="flex justify-between items-center text-xs bg-gray-50 dark:bg-gray-700/50 px-2.5 py-1.5 rounded">
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{f.label}</span>
                        <span className="text-[10px] text-gray-400 ml-1.5 font-mono">({f.fieldName})</span>
                      </div>
                      <span className="o-badge o-badge-muted">{f.fieldType}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Field Modal */}
      {newFieldModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-md">
            <div className="o-modal-header">
              <span>Add Custom Field</span>
              <button onClick={() => setNewFieldModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateField}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Target Business Model:</label>
                  <select
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                  >
                    {MODELS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="o-field">
                  <label>Field Display Label:</label>
                  <input
                    required
                    placeholder="e.g. Industry Type"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Technical Field Name:</label>
                    <input
                      required
                      placeholder="e.g. industry_code"
                      value={fieldName}
                      onChange={(e) => setFieldName(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>Data Type:</label>
                    <select
                      value={fieldType}
                      onChange={(e) => setFieldType(e.target.value)}
                    >
                      <option value="char">Char / Text</option>
                      <option value="integer">Integer (Number)</option>
                      <option value="float">Float (Decimal)</option>
                      <option value="boolean">Boolean (Yes/No)</option>
                      <option value="selection">Dropdown Selection</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewFieldModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Append Field</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
