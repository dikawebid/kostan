import React, { useState } from 'react';
import { Users, Shield, ShieldCheck, Edit, Trash2, Search, UserPlus, Crown, User as UserIcon, Calendar, Mail, MoreVertical } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { updateUserAdminStatus, deleteUserDocument } from '../services/userService';
import { User } from '../types';

const UserManager: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { users, loading, error, stats, refetch } = useUsers(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      filterRole === 'all' || 
      (filterRole === 'admin' && user.isAdmin) ||
      (filterRole === 'user' && !user.isAdmin);

    return matchesSearch && matchesRole;
  });

  const handleToggleAdmin = async (user: User) => {
    if (user.uid === currentUser?.uid) {
      alert('Anda tidak dapat mengubah status admin diri sendiri');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin ${user.isAdmin ? 'mencabut' : 'memberikan'} akses admin untuk ${user.displayName || user.email}?`)) {
      try {
        await updateUserAdminStatus(user.uid, !user.isAdmin);
        refetch();
      } catch (error) {
        console.error('Error updating admin status:', error);
        alert('Gagal mengubah status admin');
      }
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.uid === currentUser?.uid) {
      alert('Anda tidak dapat menghapus akun diri sendiri');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus user ${user.displayName || user.email}? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await deleteUserDocument(user.uid);
        refetch();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Gagal menghapus user');
      }
    }
  };

  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      {/* Header with Stats */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manajemen User
        </h2>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admin Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.adminUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Regular Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.regularUsers}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <UserIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'user')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">
          Menampilkan {filteredUsers.length} dari {users.length} user
        </p>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Daftar User ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Bergabung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=3b82f6&color=fff`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.displayName || 'No Name'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.uid === currentUser?.uid && '(You)'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isAdmin
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openUserModal(user)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Lihat Detail"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {user.uid !== currentUser?.uid && (
                      <>
                        <button
                          onClick={() => handleToggleAdmin(user)}
                          className={`${
                            user.isAdmin
                              ? 'text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300'
                              : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                          }`}
                          title={user.isAdmin ? 'Cabut Admin' : 'Jadikan Admin'}
                        >
                          {user.isAdmin ? <Shield className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Hapus User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Tidak ada user yang ditemukan
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Coba ubah filter pencarian Anda
          </p>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={closeUserModal}></div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detail User</h3>
                <button
                  onClick={closeUserModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.displayName || selectedUser.email || 'User')}&background=3b82f6&color=fff`}
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedUser.displayName || 'No Name'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.isAdmin
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {selectedUser.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">User ID</label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono break-all">{selectedUser.uid}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bergabung</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(selectedUser.createdAt)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Terakhir Update</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(selectedUser.updatedAt)}</p>
                </div>

                {selectedUser.uid !== currentUser?.uid && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => {
                        handleToggleAdmin(selectedUser);
                        closeUserModal();
                      }}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                        selectedUser.isAdmin
                          ? 'bg-orange-600 hover:bg-orange-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {selectedUser.isAdmin ? 'Cabut Admin' : 'Jadikan Admin'}
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteUser(selectedUser);
                        closeUserModal();
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Hapus User
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;