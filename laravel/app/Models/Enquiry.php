<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Enquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'retailer_id',
        'product_id',
        'product_title',
        'product_category',
        'target_supplier_ids',
        'primary_supplier_id',
        'quantity_required',
        'unit',
        'target_price_per_unit',
        'delivery_location',
        'delivery_pincode',
        'expected_date',
        'specifications_summary',
        'messages',
        'status' // 'open', 'quoted', 'negotiating', 'closed'
    ];

    protected $casts = [
        'target_supplier_ids' => 'array',
        'messages' => 'array',
        'quantity_required' => 'integer',
        'target_price_per_unit' => 'decimal:2',
        'expected_date' => 'date'
    ];

    public function retailer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'retailer_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function quotations(): HasMany
    {
        return $this->hasMany(Quotation::class);
    }
}
