<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\Enquiry;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuotationController extends Controller
{
    /**
     * Manufacturer creates and submits an itemized quotation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'enquiry_id' => 'required|exists:enquiries,id',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'shipping_charges' => 'nullable|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0',
            'delivery_timeline' => 'required|string',
            'payment_terms' => 'required|string',
            'valid_until' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $enquiry = Enquiry::findOrFail($validated['enquiry_id']);
        $manufacturer = Auth::user();

        $subtotal = 0;
        $items = [];
        foreach ($validated['items'] as $item) {
            $total = $item['quantity'] * $item['unit_price'];
            $subtotal += $total;
            $items[] = array_merge($item, ['total' => $total]);
        }

        $taxRate = $validated['tax_rate'] ?? 18.0;
        $taxAmount = ($subtotal * $taxRate) / 100;
        $shipping = $validated['shipping_charges'] ?? 0;
        $grandTotal = $subtotal + $taxAmount + $shipping;

        $quotation = Quotation::create([
            'quotation_number' => 'QT-' . date('Y') . '-' . strtoupper(substr(uniqid(), -5)),
            'enquiry_id' => $enquiry->id,
            'manufacturer_id' => $manufacturer->id,
            'retailer_id' => $enquiry->retailer_id,
            'product_name' => $enquiry->product_title,
            'items' => $items,
            'subtotal' => $subtotal,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount,
            'shipping_charges' => $shipping,
            'grand_total' => $grandTotal,
            'delivery_timeline' => $validated['delivery_timeline'],
            'payment_terms' => $validated['payment_terms'],
            'valid_until' => $validated['valid_until'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'sent',
        ]);

        $enquiry->update(['status' => 'quoted']);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Quotation dispatched to buyer successfully.',
                'quotation' => $quotation,
            ], 201);
        }

        return redirect()->route('manufacturer.quotations')->with('success', 'Quotation dispatched!');
    }

    /**
     * Retailer accepts quotation and triggers Purchase Order generation.
     */
    public function accept($id)
    {
        $quotation = Quotation::findOrFail($id);

        if ($quotation->status === 'accepted') {
            return back()->with('error', 'Quotation is already accepted.');
        }

        $quotation->update(['status' => 'accepted']);

        // Create Purchase Order
        $order = Order::create([
            'order_number' => 'PO-' . date('Y') . '-' . strtoupper(substr(uniqid(), -6)),
            'quotation_id' => $quotation->id,
            'enquiry_id' => $quotation->enquiry_id,
            'retailer_id' => $quotation->retailer_id,
            'manufacturer_id' => $quotation->manufacturer_id,
            'product_title' => $quotation->product_name,
            'quantity' => $quotation->items[0]['quantity'] ?? 100,
            'unit' => 'Piece',
            'grand_total' => $quotation->grand_total,
            'payment_terms' => $quotation->payment_terms,
            'shipping_address' => 'Delivery location as specified in RFQ #' . $quotation->enquiry_id,
            'status' => 'confirmed',
        ]);

        return redirect()->route('retailer.orders')->with('success', 'Quotation accepted! Purchase Order #' . $order->order_number . ' generated.');
    }

    /**
     * Retailer declines quotation.
     */
    public function reject($id)
    {
        $quotation = Quotation::findOrFail($id);
        $quotation->update(['status' => 'rejected']);

        return back()->with('info', 'Quotation marked as declined.');
    }
}
