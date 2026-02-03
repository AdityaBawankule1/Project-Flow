import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText
} from "lucide-react";

import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import StatCard from "../components/ui/StatCard";
import ProgressBar from "../components/ui/ProgressBar";

// Charts (Recharts)
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

const Reports = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser?._id) return;

    const res = await fetch("http://localhost:5000/api/projects", {
      headers: { userid: savedUser._id }
    });

    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
  };

  // ---------------- AI / ANALYTICS LOGIC ----------------

  const today = new Date();

  const isOverdue = (deadline) => new Date(deadline) < today;

  const daysLeft = (deadline) =>
    Math.ceil((new Date(deadline) - today) / (1000 * 60 * 60 * 24));

  const atRiskProjects = projects.filter(
    p => p.progress < 50 && daysLeft(p.deadline) <= 7 && !isOverdue(p.deadline)
  );

  const overdueProjects = projects.filter(p => isOverdue(p.deadline));

  // AI Summary Text
  const aiSummary = () => {
    if (projects.length === 0) return "No project data available yet.";

    return `Out of ${projects.length} projects, ${
      atRiskProjects.length
    } are at risk and ${overdueProjects.length} are overdue. ${
      atRiskProjects.length > 0
        ? "Immediate attention is recommended."
        : "Overall project health looks good."
    }`;
  };

  // ---------------- CHART DATA ----------------

  const statusData = [
    { name: "Planning", value: projects.filter(p => p.status === "planning").length },
    { name: "In Progress", value: projects.filter(p => p.status === "in-progress").length },
    { name: "Review", value: projects.filter(p => p.status === "review").length },
    { name: "Completed", value: projects.filter(p => p.status === "completed").length }
  ];

  const COLORS = ["#94a3b8", "#3b82f6", "#facc15", "#22c55e"];

  // Client performance
  const clientStats = Object.values(
    projects.reduce((acc, project) => {
      if (!acc[project.client]) {
        acc[project.client] = {
          client: project.client,
          total: 0,
          completed: 0
        };
      }
      acc[project.client].total += 1;
      if (project.status === "completed") acc[project.client].completed += 1;
      return acc;
    }, {})
  );

  // ---------------- UI ----------------

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
        <FileText /> Reports
      </h2>

      {/* AI Summary */}
      <Card>
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-yellow-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Summary</h3>
            <p className="text-gray-600">{aiSummary()}</p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Projects" value={projects.length.toString()} />
        <StatCard title="At Risk" value={atRiskProjects.length.toString()} />
        <StatCard title="Overdue" value={overdueProjects.length.toString()} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" label>
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Client Completion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={clientStats}>
              <XAxis dataKey="client" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* At Risk Table */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock /> At Risk / Overdue Projects
        </h3>

        {atRiskProjects.concat(overdueProjects).length === 0 ? (
          <p className="text-gray-500">No risky projects 🎉</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">Project</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {atRiskProjects.concat(overdueProjects).map(project => (
                <tr key={project._id} className="border-b">
                  <td className="py-2">{project.name}</td>
                  <td>
                    {isOverdue(project.deadline) ? (
                      <Badge variant="danger">Overdue</Badge>
                    ) : (
                      <Badge variant="warning">At Risk</Badge>
                    )}
                  </td>
                  <td>
                    <ProgressBar value={project.progress} />
                  </td>
                  <td>
                    {new Date(project.deadline).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default Reports;
