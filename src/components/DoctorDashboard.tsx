import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Upload,
  Brain,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  Activity,
  FileText,
} from 'lucide-react';
import { HeartbeatLogo } from './HeartbeatLogo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

import PredictionPanel from "./PredictionPanel";
  // ✅ ML PREDICTION UI

export default function DoctorDashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notificationCount] = useState(5);
  const [doctorName, setDoctorName] = useState('Doctor');

  useEffect(() => {
    const storedUser = localStorage.getItem("doctorUser");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setDoctorName(parsed.name || "Doctor");
    }
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'patients', icon: Users, label: 'Patients' },
    { id: 'upload', icon: Upload, label: 'Upload Reports' },
    { id: 'training', icon: Brain, label: 'Model Training' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: notificationCount },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const stats = [
    { label: 'Total Patients', value: '248', change: '+12%', icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Active Models', value: '8', change: '+2', icon: Brain, color: 'from-purple-500 to-pink-600' },
    { label: 'Reports Today', value: '34', change: '+18%', icon: FileText, color: 'from-green-500 to-emerald-600' },
    { label: 'Accuracy Rate', value: '94.2%', change: '+2.1%', icon: TrendingUp, color: 'from-orange-500 to-red-600' },
  ];

  const patients = [
    { id: 1, name: 'John Doe', age: 45, condition: 'Hypertension', risk: 'Medium', lastVisit: '2025-11-01' },
    { id: 2, name: 'Jane Smith', age: 32, condition: 'Diabetes', risk: 'Low', lastVisit: '2025-11-02' },
    { id: 3, name: 'Robert Johnson', age: 58, condition: 'Heart Disease', risk: 'High', lastVisit: '2025-11-03' },
    { id: 4, name: 'Emily Davis', age: 41, condition: 'Asthma', risk: 'Low', lastVisit: '2025-11-04' },
  ];

  const models = [
    { name: 'Cardiovascular Risk Model', progress: 85, status: 'Training' },
    { name: 'Diabetes Prediction Model', progress: 100, status: 'Completed' },
    { name: 'Cancer Detection Model', progress: 45, status: 'Training' },
  ];

  return (
    <div className="min-h-screen flex">
      
      {/* ==== SIDEBAR ==== */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 fixed h-screen overflow-y-auto shadow-xl"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <HeartbeatLogo size="md" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Meta Bridge
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeMenu === item.id
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge className="bg-red-500 text-white">{item.badge}</Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 w-4 h-4" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* ==== MAIN CONTENT ==== */}
      <div className="flex-1 ml-72">
        
        {/* TOP BAR */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl text-slate-900 dark:text-white">
                Welcome back, {doctorName}!
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Here's what's happening today
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="relative border-slate-300">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="p-8">
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border shadow-lg"
              >
                <div className="flex items-start justify-between mb  -4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge>{stat.change}</Badge>
                </div>

                <div className="text-3xl text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* PATIENT TABLE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border shadow-lg mb-8"
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl text-slate-900 dark:text-white mb-4">
                Patient Overview
              </h2>

              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search patients..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {patients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.age}</TableCell>
                    <TableCell>{p.condition}</TableCell>
                    <TableCell>
                      <Badge>{p.risk}</Badge>
                    </TableCell>
                    <TableCell>{p.lastVisit}</TableCell>
                    <TableCell>
                      <Button variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* MODEL PROGRESS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border shadow-lg mb-8 p-6"
          >
            <h2 className="text-2xl flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              Model Training Progress
            </h2>

            {models.map((model) => (
              <div key={model.name} className="mb-6">
                <div className="flex items-center justify-between">
                  <span>{model.name}</span>
                  <Badge>{model.status}</Badge>
                </div>

                <Progress value={model.progress} />
              </div>
            ))}
          </motion.div>

          {/* ==== ML PREDICTION PANEL (Heart + Diabetes) ==== */}
          <div className="mt-10">
            <PredictionPanel />
          </div>

        </main>
      </div>
    </div>
  );
}
