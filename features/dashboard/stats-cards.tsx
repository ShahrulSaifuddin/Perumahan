import { FileText, CheckCircle, Wallet, AlertCircle } from "lucide-react";

interface DashboardStats {
  complaints: {
    total: number;
    open: number;
    resolved: number;
  };
  finance: {
    totalAllocated: number;
    totalSpent: number;
    remaining: number;
    pendingMyApprovals: number;
  };
}

export function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Complaints */}
      <div className="clay-card p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Total Complaints</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-1">
            {stats.complaints.total}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {stats.complaints.open} Open
          </p>
        </div>
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
          <FileText size={24} />
        </div>
      </div>

      {/* Resolved Rate */}
      <div className="clay-card p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Resolved</p>
          <h3 className="text-3xl font-bold text-green-600 mt-1">
            {stats.complaints.total > 0
              ? Math.round(
                  (stats.complaints.resolved / stats.complaints.total) * 100,
                )
              : 0}
            %
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {stats.complaints.resolved} Resolved
          </p>
        </div>
        <div className="p-3 bg-green-100 rounded-full text-green-600">
          <CheckCircle size={24} />
        </div>
      </div>

      {/* Finance Remaining */}
      <div className="clay-card p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Funds Remaining</p>
          <h3 className="text-3xl font-bold text-emerald-700 mt-1">
            RM {stats.finance.remaining.toLocaleString()}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Allocated: RM {stats.finance.totalAllocated.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
          <Wallet size={24} />
        </div>
      </div>

      {/* Pending Actions */}
      <div className="clay-card p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Pending Actions</p>
          <h3 className="text-3xl font-bold text-orange-600 mt-1">
            {stats.finance.pendingMyApprovals}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Transactions to Review</p>
        </div>
        <div className="p-3 bg-orange-100 rounded-full text-orange-600">
          <AlertCircle size={24} />
        </div>
      </div>
    </div>
  );
}
