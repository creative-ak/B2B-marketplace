<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ImpersonationController extends Controller
{
    /**
     * Start impersonating a manufacturer or retailer with full audit logging.
     */
    public function impersonate(Request $request, User $user)
    {
        $admin = Auth::user();

        // Security Check 1: Must be an authenticated administrator
        if (!$admin || $admin->role !== 'admin') {
            abort(403, 'Unauthorized. Only Super Administrators can initiate user impersonation.');
        }

        // Security Check 2: Cannot impersonate another administrator
        if ($user->role === 'admin') {
            return back()->with('error', 'Security Policy: Impersonation of other administrator accounts is strictly forbidden.');
        }

        $reason = $request->input('reason', 'Customer support and workflow verification');

        // Audit Trail: Log impersonation start event
        AuditLog::create([
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'action' => 'IMPERSONATION_STARTED',
            'target_user_id' => $user->id,
            'target_user_name' => $user->name . ' (' . $user->business_name . ')',
            'details' => "Administrator {$admin->name} assumed session of {$user->role} '{$user->name}' ({$user->business_name}). Reason: {$reason}",
            'ip_address' => $request->ip(),
        ]);

        // Save original admin session credentials for restoration
        session()->put('admin_impersonator_id', $admin->id);
        session()->put('admin_impersonator_name', $admin->name);
        session()->put('impersonation_started_at', now()->toIso8601String());
        session()->put('impersonation_reason', $reason);

        // Switch authenticated user
        Auth::login($user);

        return redirect()->route('dashboard')->with('status', "Now impersonating {$user->name}. Click 'Exit Impersonation' in the top banner when finished.");
    }

    /**
     * Restore original admin session and record session end in audit trail.
     */
    public function restore(Request $request)
    {
        $adminId = session('admin_impersonator_id');
        $adminName = session('admin_impersonator_name');
        $startedAt = session('impersonation_started_at');
        $currentUser = Auth::user();

        if (!$adminId) {
            abort(400, 'No active impersonation session found.');
        }

        $admin = User::findOrFail($adminId);

        // Audit Trail: Log impersonation finish event
        AuditLog::create([
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'action' => 'IMPERSONATION_ENDED',
            'target_user_id' => $currentUser ? $currentUser->id : null,
            'target_user_name' => $currentUser ? $currentUser->name : 'Unknown',
            'details' => "Administrator {$adminName} safely exited impersonation session. Started at: {$startedAt}",
            'ip_address' => $request->ip(),
        ]);

        // Clear session markers
        session()->forget(['admin_impersonator_id', 'admin_impersonator_name', 'impersonation_started_at', 'impersonation_reason']);

        // Log back in as admin
        Auth::login($admin);

        return redirect()->route('admin.dashboard')->with('success', "Returned safely to Administrator workspace.");
    }
}
