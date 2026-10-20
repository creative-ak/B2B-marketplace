<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'quotation_id',
        'enquiry_id',
        'retailer_id',
        'manufacturer_id',
        'product_title',
        'quantity',
        'unit',
        'grand_total',
        'payment_terms',
        'shipping_address',
        'status' // 'confirmed', 'in_production', 'dispatched', 'delivered', 'cancelled'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'grand_total' => 'decimal:2'
    ];

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }

    public function retailer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'retailer_id');
    }

    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manufacturer_id');
    }
}
