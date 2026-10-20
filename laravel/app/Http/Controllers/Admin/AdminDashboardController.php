<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Enquiry;
use App\Models\Quotation;
use App\Models\Order;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminDashboardController extends Controller
{
    /**
     * Super Admin Overview Dashboard.
     */
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_manufacturers' => User::where('role', 'manufacturer')->count(),
            'total_retailers' => User::where('role', 'retailer')->count(),
            'pending_verifications' => User::where('verification_status', 'pending')->count(),
            'total_products' => Product::count(),
            'pending_products' => Product::where('status', 'pending_approval')->count(),
            'total_enquiries' => Enquiry::count(),
            'total_quotations' => Quotation::count(),
            'total_orders' => Order::count(),
            'gmv' => Order::sum('grand_total'),
        ];

        $users = User::latest()->paginate(10);
        $pendingProducts = Product::where('status', 'pending_approval')->with('user')->take(5)->get();
        $auditLogs = AuditLog::latest()->take(10)->get();

        return view('admin.dashboard', compact('stats', 'users', 'pendingProducts', 'auditLogs'));
    }

    /**
     * Approve or reject manufacturer verification / KYC.
     */
    public function verifyUser(Request $request, User $user)
    {
        $status = $request->input('status'); // 'verified' or 'rejected'
        $admin = Auth::user();

        $user->update(['verification_status' => $status]);

        AuditLog::create([
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'action' => 'USER_VERIFICATION_' . strtoupper($status),
            'target_user_id' => $user->id,
            'target_user_name' => $user->business_name,
            'details' => "KYC and GSTIN status updated to '{$status}' by {$admin->name}.",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "User {$user->business_name} verification status set to {$status}.");
    }

    /**
     * Suspend or reactivate user.
     */
    public function toggleUserSuspension(Request $request, User $user)
    {
        $admin = Auth::user();
        $newStatus = !$user->is_suspended;
        $user->update(['is_suspended' => $newStatus]);

        AuditLog::create([
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'action' => $newStatus ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
            'target_user_id' => $user->id,
            'target_user_name' => $user->business_name,
            'details' => "Account suspension set to " . ($newStatus ? 'TRUE' : 'FALSE'),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Account state updated.");
    }
}
