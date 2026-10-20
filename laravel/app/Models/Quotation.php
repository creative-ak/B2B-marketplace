<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_number',
        'enquiry_id',
        'manufacturer_id',
        'retailer_id',
        'product_name',
        'items',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'shipping_charges',
        'grand_total',
        'delivery_timeline',
        'payment_terms',
        'valid_until',
        'status', // 'draft', 'sent', 'under_negotiation', 'accepted', 'rejected'
        'revision_number',
        'notes'
    ];

    protected $casts = [
        'items' => 'array',
        'subtotal' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_charges' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'valid_until' => 'date',
        'revision_number' => 'integer'
    ];

    public function enquiry(): BelongsTo
    {
        return $this->belongsTo(Enquiry::class);
    }

    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manufacturer_id');
    }

    public function retailer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'retailer_id');
    }
}
