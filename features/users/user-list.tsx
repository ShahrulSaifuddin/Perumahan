import Link from "next/link";
import { Plus } from "lucide-react";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  property?: { name: string } | { name: string }[] | null;
}

export function UserList({ users }: { users: User[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">System Users</h2>
        <Link
          href="/settings/users/new"
          className="clay-btn bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:brightness-110 transition-all"
        >
          <Plus size={16} />
          Add User
        </Link>
      </div>

      <div className="clay-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Property</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.full_name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {Array.isArray(user.property)
                      ? user.property[0]?.name
                      : user.property?.name || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
