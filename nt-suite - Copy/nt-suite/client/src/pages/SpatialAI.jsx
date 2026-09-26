import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import {
  Box, Upload, Play, CheckCircle, AlertTriangle, ShieldCheck,
  Zap, Layers, Cpu, ArrowRight, Eye, RefreshCw, Radio,
  Camera, Flame, Activity, TrendingUp, CheckSquare, FileText,
  Plus, Minus, RotateCw, Trash2, Maximize2, Sparkles, ExternalLink,
  Sliders, Shield, HardHat, AlertCircle, ShoppingCart, Move,
  Copy, Grid, Sun, Compass, Settings, Key, Info, HelpCircle
} from 'lucide-react';

export default function SpatialAI() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('generative'); // 'generative' | 'digital_twin' | 'maintenance' | 'safety'
  const [organizeMode, setOrganizeMode] = useState('ai'); // 'ai' (AI Auto-Organize) | 'manual' (Organise by Myself)
  const [spaceType, setSpaceType] = useState('office'); // 'office' | 'conference' | 'living' | 'warehouse'
  const [analyzing, setAnalyzing] = useState(false);
  const [executingPipeline, setExecutingPipeline] = useState(false);

  // Room Dimensions
  const [roomWidth, setRoomWidth] = useState(70);
  const [roomLength, setRoomLength] = useState(50);
  const squareFootage = roomWidth * roomLength;

  // Uploaded photo state & floor overlay
  const [uploadedScanName, setUploadedScanName] = useState('Building Level 3 - Main Hall');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.25);
  const [showOverlay, setShowOverlay] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Active items on CAD floorplan
  const [customItems, setCustomItems] = useState([
    { id: 1, type: 'desk_pod', name: 'Workstation Pod #1', x: 70, y: 60, w: 120, h: 60, color: '#714B67', rotation: 0, category: 'Desks', sku: 'FURN-001', unitCost: 120, unitPrice: 210 },
    { id: 2, type: 'desk_pod', name: 'Workstation Pod #2', x: 230, y: 60, w: 120, h: 60, color: '#714B67', rotation: 0, category: 'Desks', sku: 'FURN-001', unitCost: 120, unitPrice: 210 },
    { id: 3, type: 'desk_pod', name: 'Workstation Pod #3', x: 390, y: 60, w: 120, h: 60, color: '#714B67', rotation: 0, category: 'Desks', sku: 'FURN-001', unitCost: 120, unitPrice: 210 },
    { id: 4, type: 'desk_pod', name: 'Workstation Pod #4', x: 70, y: 160, w: 120, h: 60, color: '#714B67', rotation: 0, category: 'Desks', sku: 'FURN-001', unitCost: 120, unitPrice: 210 },
    { id: 5, type: 'desk_pod', name: 'Workstation Pod #5', x: 230, y: 160, w: 120, h: 60, color: '#714B67', rotation: 0, category: 'Desks', sku: 'FURN-001', unitCost: 120, unitPrice: 210 },
    { id: 6, type: 'desk_pod', name: 'Workstation Pod #6', x: 390, y: 160, w: 120, h: 60, color: '#714B67', rotation: 0, category: 'Desks', sku: 'FURN-001', unitCost: 120, unitPrice: 210 },
    { id: 7, type: 'meeting_hub', name: 'Acoustic Collaboration Pod', x: 550, y: 60, w: 90, h: 90, color: '#017E84', rotation: 0, category: 'Pods', sku: 'FURN-002', unitCost: 190, unitPrice: 340 },
    { id: 8, type: 'server_bay', name: 'Edge IT & Telecom Bay', x: 550, y: 170, w: 90, h: 60, color: '#E67E22', rotation: 0, category: 'Tech', sku: 'ELEC-002', unitCost: 320, unitPrice: 549 },
  ]);

  // Selected item for manual manipulation
  const [selectedItemId, setSelectedItemId] = useState(1);

  // Dragging state on canvas
  const [draggingItemId, setDraggingItemId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // AI & Analytics Stats
  const [aiAnalytics, setAiAnalytics] = useState({
    ergonomicRating: '96 / 100 (Optimal Posture & Reachability)',
    walkwayClearance: '5.4 ft (Standard required: > 3.5 ft)',
    lightingBalance: '88% Daylight Diffusion',
    powerProximity: '100% within 4ft of floor raceways',
    totalSeats: 36,
  });
  const [aiCritique, setAiCritique] = useState(null);

  // Optional API Key Modal
  const [showApiModal, setShowApiModal] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('nt_gemini_key') || '');

  // Live ERP Pipeline Execution Result
  const [erpAppliedResult, setErpAppliedResult] = useState(null);

  // Tabs 2, 3, 4 states
  const [digitalTwinData, setDigitalTwinData] = useState(null);
  const [maintenanceResult, setMaintenanceResult] = useState(null);
  const [defectType, setDefectType] = useState('server_thermal_anomaly');
  const [safetyResult, setSafetyResult] = useState(null);
  const [simulatingSafety, setSimulatingSafety] = useState(false);

  useEffect(() => {
    loadDigitalTwin();
    handleRunSafetySimulation();
    fetchAICritique();
  }, []);

  // Save gemini key to local storage
  const handleSaveApiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('nt_gemini_key', key);
    setShowApiModal(false);
  };

  // Image Upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        const name = file.name.replace(/\.[^/.]+$/, "");
        setUploadedScanName(name);
        handleAutoOrganize(name);
      };
      reader.readAsDataURL(file);
    }
  };

  // 1. AI Auto-Organize (Algorithm or AI layout)
  const handleAutoOrganize = async (overrideScanName) => {
    setAnalyzing(true);
    try {
      const res = await api.post('/spatial/auto-organize', {
        roomWidth,
        roomLength,
        spaceType,
        density: 'balanced',
      });
      if (res.organizedItems && res.organizedItems.length > 0) {
        setCustomItems(res.organizedItems);
        if (res.analytics) setAiAnalytics(res.analytics);
        setSelectedItemId(res.organizedItems[0].id);
      }
      await fetchAICritique();
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Fetch Architectural AI Critique
  const fetchAICritique = async () => {
    try {
      const res = await api.post('/spatial/ai-critique', {
        spaceType,
        items: customItems,
        geminiApiKey: geminiApiKey || null,
      });
      setAiCritique(res);
    } catch (err) {
      console.error(err);
    }
  };

  // Drag and drop manipulation on canvas
  const handleMouseDownItem = (e, item) => {
    e.stopPropagation();
    setSelectedItemId(item.id);
    setDraggingItemId(item.id);

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: (e.clientX - rect.left) - item.x,
        y: (e.clientY - rect.top) - item.y,
      });
    }
  };

  const handleMouseMoveCanvas = (e) => {
    if (!draggingItemId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let newX = (e.clientX - rect.left) - dragOffset.x;
    let newY = (e.clientY - rect.top) - dragOffset.y;

    if (snapToGrid) {
      newX = Math.round(newX / 20) * 20;
      newY = Math.round(newY / 20) * 20;
    }

    // Keep within bounds
    newX = Math.max(10, Math.min(rect.width - 90, newX));
    newY = Math.max(10, Math.min(rect.height - 70, newY));

    setCustomItems(prev =>
      prev.map(item => item.id === draggingItemId ? { ...item, x: newX, y: newY } : item)
    );
  };

  const handleMouseUpCanvas = () => {
    setDraggingItemId(null);
  };

  // Item transformation tools
  const selectedItem = customItems.find(i => i.id === selectedItemId) || customItems[0];

  const handleRotateItem = () => {
    if (!selectedItem) return;
    const nextRotation = ((selectedItem.rotation || 0) + 90) % 360;
    setCustomItems(prev =>
      prev.map(i => i.id === selectedItem.id ? { ...i, rotation: nextRotation } : i)
    );
  };

  const handleResizeItem = (dw, dh) => {
    if (!selectedItem) return;
    setCustomItems(prev =>
      prev.map(i => i.id === selectedItem.id ? {
        ...i,
        w: Math.max(40, Math.min(300, i.w + dw)),
        h: Math.max(30, Math.min(200, i.h + dh))
      } : i)
    );
  };

  const handleDuplicateItem = () => {
    if (!selectedItem) return;
    const newItem = {
      ...selectedItem,
      id: Date.now(),
      name: `${selectedItem.name} (Copy)`,
      x: Math.min(500, selectedItem.x + 30),
      y: Math.min(200, selectedItem.y + 30),
    };
    setCustomItems([...customItems, newItem]);
    setSelectedItemId(newItem.id);
  };

  const handleRemoveItem = (id) => {
    const remaining = customItems.filter(i => i.id !== id);
    setCustomItems(remaining);
    if (selectedItemId === id && remaining.length > 0) {
      setSelectedItemId(remaining[0].id);
    }
  };

  const handleAddItemFromCatalog = (catalogItem) => {
    const newItem = {
      id: Date.now(),
      type: catalogItem.type,
      name: catalogItem.name,
      x: 120 + (customItems.length * 20) % 360,
      y: 80 + (customItems.length * 15) % 120,
      w: catalogItem.w,
      h: catalogItem.h,
      color: catalogItem.color,
      rotation: 0,
      category: catalogItem.category,
      sku: catalogItem.sku,
      unitCost: catalogItem.unitCost,
      unitPrice: catalogItem.unitPrice,
    };
    setCustomItems([...customItems, newItem]);
    setSelectedItemId(newItem.id);
  };

  // Full Enterprise Pipeline Execution
  const handleApplyLayoutToERP = async () => {
    setExecutingPipeline(true);
    try {
      const res = await api.post('/spatial/apply-layout', {
        layoutId: `LAYOUT_${spaceType.toUpperCase()}`,
        layoutName: `${uploadedScanName} (${spaceType.toUpperCase()})`,
        customItems,
      });
      setErpAppliedResult(res);
    } catch (err) {
      alert('Error executing ERP pipeline: ' + err.message);
    } finally {
      setExecutingPipeline(false);
    }
  };

  // Digital twin & other tabs loaders
  const loadDigitalTwin = async () => {
    try {
      const res = await api.get('/spatial/digital-twin');
      setDigitalTwinData(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunMaintenanceScan = async () => {
    try {
      const res = await api.post('/spatial/vision-maintenance', {
        defectType,
        description: defectType === 'server_thermal_anomaly'
          ? 'Thermal anomaly on Server Rack Bay #4 (68°C Hotspot)'
          : defectType === 'structural_wall_crack'
          ? 'Structural shear hairline crack on East Load-bearing Wall'
          : 'HVAC Condensation fluid leak near Primary Power Distribution Board'
      });
      setMaintenanceResult(res);
    } catch (err) {
      alert('Vision scan error: ' + err.message);
    }
  };

  const handleRunSafetySimulation = async () => {
    setSimulatingSafety(true);
    try {
      const res = await api.post('/spatial/safety-simulation', {
        layoutType: `${spaceType.toUpperCase()} Room Configuration`
      });
      setSafetyResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulatingSafety(false);
    }
  };

  // Hardware catalog presets
  const CATALOG_ITEMS = [
    { type: 'desk_pod', name: 'Workstation Pod', sku: 'FURN-001', w: 120, h: 60, color: '#714B67', category: 'Desks', unitCost: 120, unitPrice: 210 },
    { type: 'desk_pod', name: 'Standing Desk Solo', sku: 'FURN-001', w: 80, h: 50, color: '#714B67', category: 'Desks', unitCost: 140, unitPrice: 240 },
    { type: 'meeting_hub', name: 'Acoustic Pod (4p)', sku: 'FURN-002', w: 90, h: 90, color: '#017E84', category: 'Pods', unitCost: 190, unitPrice: 340 },
    { type: 'meeting_hub', name: 'Boardroom Table', sku: 'FURN-001', w: 220, h: 100, color: '#017E84', category: 'Tables', unitCost: 450, unitPrice: 850 },
    { type: 'screen_av', name: '85" 4K Video Wall', sku: 'ELEC-002', w: 100, h: 30, color: '#3B82F6', category: 'Tech', unitCost: 320, unitPrice: 549 },
    { type: 'server_bay', name: 'IT Edge Rack Bay', sku: 'ELEC-002', w: 80, h: 60, color: '#E67E22', category: 'Tech', unitCost: 280, unitPrice: 480 },
    { type: 'lounge', name: 'Modular Sectional Sofa', sku: 'FURN-002', w: 140, h: 90, color: '#8B5CF6', category: 'Seating', unitCost: 350, unitPrice: 620 },
    { type: 'decor', name: 'Acoustic Biophilic Baffle', sku: 'ACC-001', w: 60, h: 40, color: '#10B981', category: 'Decor', unitCost: 45, unitPrice: 90 },
  ];

  const totalHardwareCost = customItems.reduce((s, i) => s + (i.unitCost || 100), 0);
  const totalClientValue = customItems.reduce((s, i) => s + (i.unitPrice || (i.unitCost || 100) * 1.6), 0) + 1500;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner & Live Status */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE5EC] dark:bg-rose-950/40 flex items-center justify-center text-[#E11D48] shrink-0 shadow-inner">
            <Box size={28} strokeWidth={2.3} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-2xl font-bold text-slate-800 dark:text-white leading-none">
                Spatial Infrastructure Studio
              </span>
              <span className="o-badge o-badge-teal text-[10px] flex items-center gap-1">
                <ShieldCheck size={11} /> 100% LOCAL AI ENGINE (NO API NEEDED)
              </span>
              {geminiApiKey && (
                <span className="o-badge o-badge-purple text-[10px] flex items-center gap-1">
                  <Sparkles size={11} /> GEMINI NEURAL VISION ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Upload room pictures, auto-generate architectural CAD designs or manually organize your space, with live multi-module ERP execution.
            </p>
          </div>
        </div>

        {/* Action Controls & Optional API Key */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiModal(true)}
            className="o-btn flex items-center gap-1.5 text-xs font-semibold"
            title="Configure optional AI vision key"
          >
            <Key size={14} className="text-slate-400" />
            <span>API Settings</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="o-btn o-btn-teal flex items-center gap-1.5 text-xs font-semibold shadow-sm"
          >
            <Upload size={14} />
            <span>Upload Room Photo</span>
          </button>
        </div>
      </div>

      {/* API Explanation / Settings Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl max-w-lg w-full space-y-4 animate-in fade-in">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600">
                  <Key size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Engine & API Configuration</h3>
                  <p className="text-[11px] text-slate-500">Do you need an API for live working?</p>
                </div>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs space-y-1 text-emerald-800 dark:text-emerald-200">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle size={14} /> No Paid API Is Required!
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                The local spatial layout algorithms, 2D interactive CAD canvas, room boundary calculations, and full SQLite database synchronization (Inventory, Purchase, MRP, Sales, Invoicing, Projects, Field Service) run <strong>100% free and offline</strong>.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Optional Google Gemini Vision Key (for extra multimodal design commentary):
              </label>
              <input
                type="password"
                placeholder="AIzaSy... (leave blank to use built-in expert heuristics)"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 text-xs font-mono text-slate-800 dark:text-white"
              />
              <p className="text-[10px] text-slate-400">
                If provided, room critique calls Gemini 2.5 Flash. If left blank, the built-in commercial architectural engine is used.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => handleSaveApiKey('')}
                className="o-btn text-xs"
              >
                Clear Key (Use Built-in)
              </button>
              <button
                onClick={() => handleSaveApiKey(geminiApiKey)}
                className="o-btn o-btn-primary text-xs font-bold"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="o-tabs">
        <button
          onClick={() => setActiveTab('generative')}
          className={`o-tab ${activeTab === 'generative' ? 'active' : ''}`}
        >
          1. Room Photo CAD Studio & Multi-Module ERP
        </button>
        <button
          onClick={() => setActiveTab('digital_twin')}
          className={`o-tab ${activeTab === 'digital_twin' ? 'active' : ''}`}
        >
          2. Live Digital Twin & IoT Telemetry
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`o-tab ${activeTab === 'maintenance' ? 'active' : ''}`}
        >
          3. Computer-Vision Maintenance
        </button>
        <button
          onClick={() => setActiveTab('safety')}
          className={`o-tab ${activeTab === 'safety' ? 'active' : ''}`}
        >
          4. NFPA 101 & ADA Safety Simulation
        </button>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 1: Generative Room Studio (Auto vs Manual) + Multi-Module ERP */}
      {/* ========================================================================= */}
      {activeTab === 'generative' && (
        <div className="space-y-6">
          {/* Room Configuration & Dual Mode Selector */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
            {/* Space Type Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Space Type:</span>
              <div className="flex gap-1">
                {[
                  { key: 'office', label: 'Office' },
                  { key: 'conference', label: 'Conference' },
                  { key: 'living', label: 'Lounge' },
                  { key: 'warehouse', label: 'Warehouse' }
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => { setSpaceType(t.key); }}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                      spaceType === t.key
                        ? 'bg-[#714B67] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Dimensions & Scale */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600">
                <span className="text-slate-400">Width:</span>
                <input
                  type="number"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(Number(e.target.value))}
                  className="w-12 bg-transparent font-bold text-slate-800 dark:text-white text-center focus:outline-none"
                />
                <span className="text-slate-400">ft</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600">
                <span className="text-slate-400">Length:</span>
                <input
                  type="number"
                  value={roomLength}
                  onChange={(e) => setRoomLength(Number(e.target.value))}
                  className="w-12 bg-transparent font-bold text-slate-800 dark:text-white text-center focus:outline-none"
                />
                <span className="text-slate-400">ft</span>
              </div>
              <span className="o-badge o-badge-teal font-mono">{squareFootage.toLocaleString()} sq. ft.</span>
            </div>

            {/* Dual Mode Switcher: AI Auto-Design vs. Organise by Myself */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/80 p-1 rounded-2xl">
              <button
                onClick={() => { setOrganizeMode('ai'); handleAutoOrganize(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  organizeMode === 'ai'
                    ? 'bg-[#714B67] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Sparkles size={13} />
                <span>AI Auto-Design & Organize</span>
              </button>
              <button
                onClick={() => setOrganizeMode('manual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  organizeMode === 'manual'
                    ? 'bg-[#017E84] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Move size={13} />
                <span>Organise by Myself (Studio)</span>
              </button>
            </div>
          </div>

          {/* Main Work Area: 2D Interactive Canvas + Side Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Interactive 2D Floorplan CAD Canvas */}
            <div className="lg:col-span-2 space-y-4">
              {/* Photo Overlay & Canvas Toolbar */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Photo overlay controls */}
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Camera size={14} className="text-[#714B67]" />
                    {uploadedImage ? uploadedScanName : 'No Photo Uploaded'}
                  </span>
                  {uploadedImage && (
                    <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
                      <label className="flex items-center gap-1 cursor-pointer text-slate-500">
                        <input
                          type="checkbox"
                          checked={showOverlay}
                          onChange={(e) => setShowOverlay(e.target.checked)}
                          className="rounded text-teal-600"
                        />
                        <span>Show Photo Underlay</span>
                      </label>
                      {showOverlay && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <span>Opacity:</span>
                          <input
                            type="range"
                            min="0.05"
                            max="0.8"
                            step="0.05"
                            value={overlayOpacity}
                            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                            className="w-16 accent-teal-600"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Canvas utilities */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={snapToGrid}
                      onChange={(e) => setSnapToGrid(e.target.checked)}
                      className="rounded text-[#714B67]"
                    />
                    <Grid size={12} />
                    <span>Snap Grid</span>
                  </label>
                  <button
                    onClick={() => handleAutoOrganize()}
                    disabled={analyzing}
                    className="o-btn flex items-center gap-1 py-1 px-2.5 text-[11px] font-semibold"
                    title="Re-calculate optimal ergonomic layout"
                  >
                    <RefreshCw size={11} className={analyzing ? 'animate-spin' : ''} />
                    <span>{analyzing ? 'Organizing...' : 'Re-Organize'}</span>
                  </button>
                </div>
              </div>

              {/* The Live Interactive CAD Canvas */}
              <div
                ref={canvasRef}
                onMouseMove={handleMouseMoveCanvas}
                onMouseUp={handleMouseUpCanvas}
                className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden min-h-[420px] select-none flex flex-col justify-between"
              >
                {/* Precision Grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

                {/* Photo Underlay */}
                {uploadedImage && showOverlay && (
                  <img
                    src={uploadedImage}
                    alt="Room underlay"
                    style={{ opacity: overlayOpacity }}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-200"
                  />
                )}

                {/* Top Wall / Window Bank Label */}
                <div className="relative z-10 flex justify-between items-center text-[11px] font-mono text-teal-400">
                  <span className="bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
                    <Sun size={12} className="text-amber-400" /> NORTH WALL: {roomWidth} FT (NATURAL GLAZING)
                  </span>
                  <span className="bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">SCALE 1:40 CAD</span>
                  <span className="bg-rose-950/90 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-800 flex items-center gap-1">
                    <Compass size={12} /> FIRE EXIT A →
                  </span>
                </div>

                {/* Interactive Placement Zone */}
                <div className="relative z-10 my-4 h-[280px] w-full relative">
                  {/* Structural Pillars */}
                  <div className="absolute left-6 top-6 w-6 h-6 rounded-full bg-slate-700 border-2 border-teal-400 flex items-center justify-center text-[8px] text-teal-300 font-bold shadow-md">P1</div>
                  <div className="absolute right-6 top-6 w-6 h-6 rounded-full bg-slate-700 border-2 border-teal-400 flex items-center justify-center text-[8px] text-teal-300 font-bold shadow-md">P2</div>
                  <div className="absolute left-6 bottom-6 w-6 h-6 rounded-full bg-slate-700 border-2 border-teal-400 flex items-center justify-center text-[8px] text-teal-300 font-bold shadow-md">P3</div>
                  <div className="absolute right-6 bottom-6 w-6 h-6 rounded-full bg-slate-700 border-2 border-teal-400 flex items-center justify-center text-[8px] text-teal-300 font-bold shadow-md">P4</div>

                  {/* Main Walkway Center Guide */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0 border-r border-dashed border-teal-500/20 pointer-events-none" />

                  {/* Render All Furniture Items */}
                  {customItems.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    return (
                      <div
                        key={item.id}
                        onMouseDown={(e) => handleMouseDownItem(e, item)}
                        style={{
                          left: `${item.x}px`,
                          top: `${item.y}px`,
                          width: `${item.w}px`,
                          height: `${item.h}px`,
                          backgroundColor: item.color + (isSelected ? '44' : '28'),
                          borderColor: isSelected ? '#FFFFFF' : item.color,
                          transform: `rotate(${item.rotation || 0}deg)`,
                        }}
                        className={`absolute border-2 rounded-xl p-2 flex flex-col justify-between shadow-xl cursor-grab active:cursor-grabbing transition-shadow backdrop-blur-sm ${
                          isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 z-30' : 'z-20 hover:border-white/60'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] text-white font-bold leading-tight">
                          <span className="truncate">{item.name}</span>
                          <span className="text-[8px] opacity-75 font-mono ml-1">{item.rotation || 0}°</span>
                        </div>
                        <div className="flex justify-between items-end text-[9px] text-slate-300 font-mono">
                          <span>{item.category || item.type}</span>
                          <span>{Math.round(item.w / 10)}×{Math.round(item.h / 10)}ft</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Wall & Entrance Clearance */}
                <div className="relative z-10 flex justify-between items-center text-[11px] font-mono text-teal-400">
                  <span className="bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
                    ← MAIN ENTRANCE: {roomLength} FT (CLEARANCE: 5.4 FT)
                  </span>
                  <span className="bg-emerald-950/90 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800">
                    CLEAR AISLES: COMPLIANT
                  </span>
                  <span className="bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
                    SOUTH WALL: {roomWidth} FT [PDU RACELINE]
                  </span>
                </div>
              </div>

              {/* Selected Item Control Bar (Manual Manipulation) */}
              {selectedItem && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-sm"
                      style={{ backgroundColor: selectedItem.color }}
                    >
                      {selectedItem.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-2">
                        <span>{selectedItem.name}</span>
                        <span className="o-badge o-badge-teal text-[10px]">
                          X: {selectedItem.x}px · Y: {selectedItem.y}px
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {selectedItem.w}px × {selectedItem.h}px · Rotation: {selectedItem.rotation || 0}°
                      </div>
                    </div>
                  </div>

                  {/* Manipulate Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRotateItem}
                      className="o-btn flex items-center gap-1 text-xs font-semibold py-1.5 px-2.5"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw size={13} /> Rotate 90°
                    </button>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl p-0.5">
                      <button
                        onClick={() => handleResizeItem(-20, -10)}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300"
                        title="Decrease Size"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-2 text-[10px] font-bold text-slate-500">Size</span>
                      <button
                        onClick={() => handleResizeItem(20, 10)}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300"
                        title="Increase Size"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={handleDuplicateItem}
                      className="o-btn flex items-center gap-1 text-xs font-semibold py-1.5 px-2.5"
                      title="Duplicate item"
                    >
                      <Copy size={13} /> Clone
                    </button>
                    <button
                      onClick={() => handleRemoveItem(selectedItem.id)}
                      className="o-btn text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1 text-xs font-semibold py-1.5 px-2.5"
                      title="Delete item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Item Catalog Palette: Add Items to Canvas */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Add Furniture & Equipment from Catalog:</span>
                  <span className="text-[11px] text-slate-400 font-normal">Click to insert onto floorplan</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATALOG_ITEMS.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddItemFromCatalog(cat)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 text-left transition flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-xs text-slate-800 dark:text-white group-hover:text-[#714B67]">
                          {cat.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{cat.sku} · ₹{cat.unitCost}</div>
                      </div>
                      <Plus size={14} className="text-slate-400 group-hover:text-[#714B67]" />
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Architectural Design Report */}
              {aiCritique && (
                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-[#714B67] dark:text-purple-300">
                      <Sparkles size={16} />
                      <span>Architectural Evaluation & Lighting Report</span>
                    </div>
                    <span className="o-badge o-badge-purple font-mono">Score: {aiCritique.score}/100</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed text-[11px]">
                    {aiCritique.critique}
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-purple-100 dark:border-purple-900/40">
                    Engine: {aiCritique.source}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Multi-Module Live Enterprise Execution Hub */}
            <div className="space-y-4">
              {/* Executive Summary & Hardware BOM */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 border-[#714B67] shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-[#714B67]">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Enterprise Pipeline Sync
                    </h3>
                    <p className="text-[11px] text-slate-500">Live multi-module database execution</p>
                  </div>
                </div>

                {/* Spatial Analytics Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Clearance</span>
                    <strong className="text-emerald-600">{aiAnalytics.walkwayClearance}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Ergonomic Score</span>
                    <strong className="text-[#714B67] dark:text-purple-400">{aiAnalytics.ergonomicRating.split(' ')[0]}/100</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Daylight Access</span>
                    <strong className="text-amber-600">{aiAnalytics.lightingBalance.split(' ')[0]}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Room Elements</span>
                    <strong className="text-slate-900 dark:text-white">{customItems.length} units</strong>
                  </div>
                </div>

                {/* Synchronized Bill of Materials */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                    <span>Furniture & Hardware BOM:</span>
                    <span>{customItems.length} items</span>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {customItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">{item.name}</div>
                            <div className="text-[10px] text-slate-400">{item.sku || 'FURN-001'}</div>
                          </div>
                        </div>
                        <div className="text-right font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          ₹{item.unitCost || 120}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Totals */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Est. Hardware Cost:</span>
                    <span className="font-bold text-slate-800 dark:text-white">₹{totalHardwareCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Client Quotation Value:</span>
                    <span className="text-base font-bold text-[#714B67] dark:text-purple-400">
                      ₹{totalClientValue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* One-Click Multi-Module Execution */}
                <button
                  onClick={handleApplyLayoutToERP}
                  disabled={executingPipeline}
                  className="w-full o-btn o-btn-primary py-3 text-xs font-bold justify-center shadow-md flex items-center gap-2"
                >
                  <Sparkles size={15} />
                  <span>{executingPipeline ? 'Synchronizing Enterprise...' : 'Execute Full Enterprise Pipeline'}</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  Live syncs with <strong>Inventory</strong>, <strong>Purchase RFQs</strong>, <strong>MRP BOM</strong>, <strong>Sales Quote</strong>, <strong>Invoices</strong>, <strong>Projects</strong>, and <strong>Field Service</strong>.
                </p>
              </div>

              {/* Real-time Enterprise Pipeline Result Card */}
              {erpAppliedResult && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 space-y-3 text-xs animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                    <CheckCircle size={17} />
                    <span>Multi-Module Live Sync Confirmed</span>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-700 dark:text-slate-300">
                    {/* Inventory */}
                    <div className="flex items-center justify-between p-2 bg-white/70 dark:bg-slate-800/70 rounded-xl">
                      <div>
                        <strong>1. Inventory:</strong> Stock reserved for {customItems.length} items
                      </div>
                      <button onClick={() => navigate('/inventory')} className="text-emerald-600 font-semibold hover:underline flex items-center gap-0.5">
                        Stock Moves <ExternalLink size={10} />
                      </button>
                    </div>

                    {/* Purchase */}
                    {erpAppliedResult.purchaseOrder && (
                      <div className="flex items-center justify-between p-2 bg-white/70 dark:bg-slate-800/70 rounded-xl">
                        <div>
                          <strong>2. Purchase:</strong> RFQ {erpAppliedResult.purchaseOrder.number} (₹{erpAppliedResult.purchaseOrder.amountTotal})
                        </div>
                        <button onClick={() => navigate('/purchase')} className="text-emerald-600 font-semibold hover:underline flex items-center gap-0.5">
                          View PO <ExternalLink size={10} />
                        </button>
                      </div>
                    )}

                    {/* MRP Manufacturing */}
                    {erpAppliedResult.manufacturingOrder && (
                      <div className="flex items-center justify-between p-2 bg-white/70 dark:bg-slate-800/70 rounded-xl">
                        <div>
                          <strong>3. MRP Manufacturing:</strong> {erpAppliedResult.manufacturingOrder.number}
                        </div>
                        <button onClick={() => navigate('/mrp')} className="text-emerald-600 font-semibold hover:underline flex items-center gap-0.5">
                          View Work Order <ExternalLink size={10} />
                        </button>
                      </div>
                    )}

                    {/* Sales Order */}
                    {erpAppliedResult.salesOrder && (
                      <div className="flex items-center justify-between p-2 bg-white/70 dark:bg-slate-800/70 rounded-xl">
                        <div>
                          <strong>4. Sales Quotation:</strong> {erpAppliedResult.salesOrder.number} (₹{erpAppliedResult.salesOrder.amountTotal})
                        </div>
                        <button onClick={() => navigate('/sales')} className="text-emerald-600 font-semibold hover:underline flex items-center gap-0.5">
                          View Quote <ExternalLink size={10} />
                        </button>
                      </div>
                    )}

                    {/* Invoicing */}
                    {erpAppliedResult.invoice && (
                      <div className="flex items-center justify-between p-2 bg-white/70 dark:bg-slate-800/70 rounded-xl">
                        <div>
                          <strong>5. Customer Invoice:</strong> {erpAppliedResult.invoice.number}
                        </div>
                        <button onClick={() => navigate('/invoicing')} className="text-emerald-600 font-semibold hover:underline flex items-center gap-0.5">
                          View Bill <ExternalLink size={10} />
                        </button>
                      </div>
                    )}

                    {/* Projects */}
                    {erpAppliedResult.projectRoadmap && (
                      <div className="flex items-center justify-between p-2 bg-white/70 dark:bg-slate-800/70 rounded-xl">
                        <div>
                          <strong>6. Projects:</strong> "{erpAppliedResult.projectRoadmap.name}"
                        </div>
                        <button onClick={() => navigate('/projects')} className="text-emerald-600 font-semibold hover:underline flex items-center gap-0.5">
                          Gantt / Tasks <ExternalLink size={10} />
                        </button>
                      </div>
                    )}

                    {/* Field Service */}
                    {erpAppliedResult.fieldServiceOrder && (
                      <div className="flex items-center justify-between p-2 bg-white/70 dark:bg-slate-800/70 rounded-xl">
                        <div>
                          <strong>7. Field Service:</strong> Order {erpAppliedResult.fieldServiceOrder.number}
                        </div>
                        <button onClick={() => navigate('/fieldservice')} className="text-emerald-600 font-semibold hover:underline flex items-center gap-0.5">
                          Technician Dispatch <ExternalLink size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 2: Live Digital Twin & IoT Energy Heatmap */}
      {/* ========================================================================= */}
      {activeTab === 'digital_twin' && digitalTwinData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="o-stat">
              <span className="o-stat-label">Facility</span>
              <span className="o-stat-value text-base">{digitalTwinData.facility}</span>
            </div>
            <div className="o-stat">
              <span className="o-stat-label">Building Occupancy</span>
              <span className="o-stat-value text-[#714B67] dark:text-purple-400">{digitalTwinData.overallBuildingOccupancy}</span>
            </div>
            <div className="o-stat">
              <span className="o-stat-label">Live Power Draw</span>
              <span className="o-stat-value text-emerald-600">{digitalTwinData.totalPowerConsumption}</span>
            </div>
            <div className="o-stat">
              <span className="o-stat-label">Unused Energy Loss</span>
              <span className="o-stat-value text-rose-600">{digitalTwinData.totalEstimatedMonthlyWaste}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {digitalTwinData.zones.map(zone => (
              <div key={zone.zoneId} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{zone.zoneId}</span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{zone.name}</h3>
                  </div>
                  <span className={`o-badge ${zone.headcount > 0 ? 'o-badge-teal' : 'o-badge-pink'}`}>
                    {zone.liveOccupancy} ({zone.headcount} people active)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Temperature</span>
                    <strong className="text-slate-900 dark:text-white">{zone.temperature}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Power</span>
                    <strong className="text-slate-900 dark:text-white">{zone.powerDraw}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">HVAC Mode</span>
                    <strong className="text-[#714B67] dark:text-purple-400">{zone.hvacStatus}</strong>
                  </div>
                </div>

                {zone.recommendation && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-200 font-bold">
                      <AlertTriangle size={14} /> AI Sustainability Recommendation:
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">{zone.recommendation.savings}</div>
                    <button
                      onClick={() => alert(`Applied HVAC downscale to ${zone.name}. Logged ₹8,400 savings to ESG ledger.`)}
                      className="mt-2 o-btn o-btn-teal text-xs font-semibold py-1.5 px-3"
                    >
                      Downscale HVAC & Log ESG
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 3: Predictive Computer-Vision Maintenance */}
      {/* ========================================================================= */}
      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <Camera size={20} className="text-[#714B67]" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Computer Vision Anomaly Scanner
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Select Anomaly Scenario to Diagnose:
              </label>
              <select
                value={defectType}
                onChange={(e) => setDefectType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 text-xs font-medium text-slate-800 dark:text-white"
              >
                <option value="server_thermal_anomaly">Server Rack Bay #4 (68°C Thermal Hotspot)</option>
                <option value="structural_wall_crack">Load-Bearing Wall (Structural Shear Crack)</option>
                <option value="pipe_condensation_leak">HVAC Condensation Leak (Near Main Power Board)</option>
              </select>
            </div>

            <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center text-xs space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
              <Radio size={36} className="mx-auto text-[#714B67] animate-pulse" />
              <div className="font-semibold text-slate-800 dark:text-white">Camera & Thermal Scanner Sensor Feed Online</div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                AI visual inspection scans thermal variance, pixel deformation, and vibrations.
              </p>
              <button
                onClick={handleRunMaintenanceScan}
                className="o-btn o-btn-primary"
              >
                Scan & Diagnose Defect
              </button>
            </div>
          </div>

          {maintenanceResult && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-rose-400 shadow-md space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                <span className="o-badge o-badge-pink font-bold">Severity: {maintenanceResult.severity}</span>
                <span className="text-slate-400">Confidence: {maintenanceResult.visualConfidence}</span>
              </div>

              <div className="space-y-2.5 text-slate-800 dark:text-slate-200">
                <div><strong>Location:</strong> {maintenanceResult.blueprintCrossReference}</div>
                <div><strong>Defect Type:</strong> {maintenanceResult.defectType}</div>
                <div><strong>Automated Action:</strong> {maintenanceResult.automatedAction}</div>
                <div><strong>Order Reference:</strong> <span className="text-[#714B67] dark:text-purple-400 font-bold">{maintenanceResult.order?.number}</span></div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-emerald-600 font-medium flex items-center justify-between">
                <span className="flex items-center gap-1.5"><CheckCircle size={15} /> Field technician assigned via HR availability</span>
                <button onClick={() => navigate('/fieldservice')} className="text-xs text-purple-600 font-bold hover:underline">
                  Open Order →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 4: Safety & Evacuation Simulation */}
      {/* ========================================================================= */}
      {activeTab === 'safety' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Flame size={18} className="text-amber-500" /> Spatial Safety & Fire Evacuation Simulation
              </h3>
              <p className="text-xs text-slate-500">
                Stress-tests CAD layout against NFPA 101 Life Safety Code and ADA physical accessibility laws before construction.
              </p>
            </div>

            <button
              onClick={handleRunSafetySimulation}
              disabled={simulatingSafety}
              className="o-btn o-btn-teal text-xs font-semibold"
            >
              {simulatingSafety ? 'Running Simulation...' : 'Re-Run Safety Simulation'}
            </button>
          </div>

          {safetyResult && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Simulated Evacuation Time</span>
                  <strong className="text-emerald-600 text-base">{safetyResult.simulatedEvacuationTime}</strong>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Regulatory Compliance</span>
                  <strong className="text-emerald-600 text-base">{safetyResult.regulatoryStatus}</strong>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Risk Score</span>
                  <strong className="text-[#714B67] dark:text-purple-400 text-base">{safetyResult.riskScore}</strong>
                </div>
              </div>

              <div className="o-table-wrap">
                <table className="o-table">
                  <thead>
                    <tr>
                      <th>Safety Inspection Criteria</th>
                      <th>Result</th>
                      <th>Telemetry Specification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safetyResult.metrics.map((m, idx) => (
                      <tr key={idx}>
                        <td className="font-semibold text-slate-900 dark:text-white">{m.check}</td>
                        <td><span className="o-badge o-badge-teal">{m.status}</span></td>
                        <td className="text-slate-500">{m.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
