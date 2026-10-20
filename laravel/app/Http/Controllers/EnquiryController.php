<?php

namespace App\Http\Controllers;

use App\Models\Enquiry;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnquiryController extends Controller
{
    /**
     * Store a newly created RFQ enquiry.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'nullable|exists:products,id',
            'product_title' => 'required|string|max:255',
            'product_category' => 'required|string|max:255',
            'primary_supplier_id' => 'required|exists:users,id',
            'target_supplier_ids' => 'nullable|array',
            'quantity_required' => 'required|integer|min:1',
            'unit' => 'required|string|max:50',
            'target_price_per_unit' => 'nullable|numeric|min:0',
            'delivery_location' => 'required|string|max:255',
            'delivery_pincode' => 'required|string|max:10',
            'specifications_summary' => 'nullable|string',
            'initial_message' => 'required|string',
        ]);

        $retailer = Auth::user();

        $enquiry = Enquiry::create([
            'retailer_id' => $retailer ? $retailer->id : 4, // Default test retailer if demo
            'product_id' => $validated['product_id'] ?? null,
            'product_title' => $validated['product_title'],
            'product_category' => $validated['product_category'],
            'primary_supplier_id' => $validated['primary_supplier_id'],
            'target_supplier_ids' => $validated['target_supplier_ids'] ?? [$validated['primary_supplier_id']],
            'quantity_required' => $validated['quantity_required'],
            'unit' => $validated['unit'],
            'target_price_per_unit' => $validated['target_price_per_unit'] ?? null,
            'delivery_location' => $validated['delivery_location'],
            'delivery_pincode' => $validated['delivery_pincode'],
            'specifications_summary' => $validated['specifications_summary'] ?? null,
            'messages' => [
                [
                    'id' => 'msg-' . uniqid(),
                    'senderId' => $retailer ? $retailer->id : 4,
                    'senderName' => $retailer ? $retailer->name : 'Buyer',
                    'senderRole' => 'retailer',
                    'message' => $validated['initial_message'],
                    'timestamp' => now()->toIso8601String(),
                ]
            ],
            'status' => 'open',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'RFQ submitted successfully. Suppliers will be notified.',
                'enquiry' => $enquiry,
            ], 201);
        }

        return redirect()->route('retailer.enquiries')->with('success', 'RFQ broadcasted successfully!');
    }

    /**
     * Show negotiation thread between buyer and manufacturer.
     */
    public function show($id)
    {
        $enquiry = Enquiry::with(['retailer', 'primarySupplier', 'quotations'])->findOrFail($id);

        return view('enquiries.show', compact('enquiry'));
    }

    /**
     * Send negotiation message or counter-price.
     */
    public function sendMessage(Request $request, $id)
    {
        $enquiry = Enquiry::findOrFail($id);
        $user = Auth::user();

        $request->validate([
            'message' => 'required|string',
            'counter_price' => 'nullable|numeric|min:0',
        ]);

        $messages = $enquiry->messages ?? [];
        $messages[] = [
            'id' => 'msg-' . uniqid(),
            'senderId' => $user->id,
            'senderName' => $user->name,
            'senderRole' => $user->role,
            'message' => $request->input('message'),
            'counterPrice' => $request->input('counter_price'),
            'timestamp' => now()->toIso8601String(),
        ];

        $enquiry->messages = $messages;
        if ($enquiry->status === 'open' || $enquiry->status === 'quoted') {
            $enquiry->status = 'negotiating';
        }
        $enquiry->save();

        return back()->with('success', 'Negotiation response sent.');
    }
}
