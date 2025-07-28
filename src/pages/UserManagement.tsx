import React, { useState } from 'react';
import { Plus, Search, Mail, Shield, Edit2, Trash2, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import InviteUserModal from '../components/Modals/InviteUserModal';

export default function UserManagement() {
  const { user } = useAuth();
  const { teamMembers, addTeamMember, updateTeamMember, removeTeamMember } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');

  // Check if user has admin privileges
  const isAdmin = user?.role === 'Admin' || user?.role === 'Scrum Master';

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to manage users.</p>
        </div>
      </div>
    );
  }

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      Admin: 'bg-primary-100 text-primary-800',
      'Scrum Master': 'bg-accent-100 text-accent-800',
      Developer: 'bg-green-100 text-green-800',
      Tester: 'bg-orange-100 text-orange-800'
    };
    return colors[role as keyof typeof colors] || colors.Developer;
  };

  const handleEditRole = (memberId: string, currentRole: string) => {
    setEditingMember(memberId);
    setEditRole(currentRole);
  };

  const handleSaveRole = (memberId: string) => {
    updateTeamMember(memberId, { role: editRole as any });
    setEditingMember(null);
    setEditRole('');
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      removeTeamMember(memberId);
    }
  };

  const roles = ['Admin', 'Scrum Master', 'Developer', 'Tester'];

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
              Team Management
            </h1>
            <p className="text-gray-600">Manage team members and their roles</p>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Member</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search members by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-primary-50 to-accent-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        {searchTerm ? 'No members match your search' : 'No team members found'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-sm font-medium text-white">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{member.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingMember === member.id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleSaveRole(member.id)}
                              className="text-green-600 hover:text-green-700 p-1"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingMember(null)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(member.role)}`}>
                            {member.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditRole(member.id, member.role)}
                            className="text-primary-600 hover:text-primary-700 p-1 rounded hover:bg-primary-50 transition-colors"
                            title="Edit Role"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member.id, member.name)}
                            className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Remove Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <InviteUserModal onClose={() => setShowInviteModal(false)} />
      )}
    </>
  );
}