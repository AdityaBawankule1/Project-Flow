import React from "react";
import {
  Users,
  UserCheck,
  Briefcase,
  Clock
} from "lucide-react";

import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";

const teamMembers = [
  {
    id: 1,
    name: "Aditya Bawankule",
    role: "Project Manager",
    email: "aditya@company.com",
    status: "active",
    workload: 85,
    projects: 5
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Frontend Developer",
    email: "sarah@company.com",
    status: "active",
    workload: 65,
    projects: 3
  },
  {
    id: 3,
    name: "Mark Lee",
    role: "Backend Developer",
    email: "mark@company.com",
    status: "on-leave",
    workload: 40,
    projects: 2
  }
];

const Team = () => {
  const activeMembers = teamMembers.filter(m => m.status === "active").length;

  const stats = [
    {
      title: "Total Team Members",
      value: teamMembers.length.toString(),
      icon: <Users className="w-6 h-6" />,
      color: "blue"
    },
    {
      title: "Active Members",
      value: activeMembers.toString(),
      icon: <UserCheck className="w-6 h-6" />,
      color: "green"
    },
    {
      title: "Total Projects",
      value: teamMembers.reduce((a, b) => a + b.projects, 0).toString(),
      icon: <Briefcase className="w-6 h-6" />,
      color: "purple"
    },
    {
      title: "Avg Workload",
      value: `${Math.round(
        teamMembers.reduce((a, b) => a + b.workload, 0) / teamMembers.length
      )}%`,
      icon: <Clock className="w-6 h-6" />,
      color: "orange"
    }
  ];

  const getStatusBadge = (status) => {
    if (status === "active") return <Badge variant="success">Active</Badge>;
    if (status === "on-leave") return <Badge variant="warning">On Leave</Badge>;
    return <Badge>Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Team</h2>
          <p className="text-gray-600">
            Manage team members and monitor workload
          </p>
        </div>
        <Button>Add Member</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Team Table */}
      <Card padding={false}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Team Members</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Workload
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {member.role}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {member.projects}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${member.workload}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {member.workload}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(member.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Team;
