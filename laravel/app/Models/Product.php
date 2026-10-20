<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'slug',
        'category',
        'subcategory',
        'sku',
        'brand',
        'unit',
        'moq',
        'base_price',
        'available_quantity',
        'lead_time_days',
        'description',
        'specifications',
        'price_tiers',
        'images',
        'status',
        'rejection_reason',
        'is_featured',
        'sample_available',
        'views_count',
        'enquiries_count'
    ];

    protected $casts = [
        'specifications' => 'array',
        'price_tiers' => 'array',
        'images' => 'array',
        'is_featured' => 'boolean',
        'sample_available' => 'boolean',
        'base_price' => 'decimal:2',
        'moq' => 'integer',
        'available_quantity' => 'integer',
        'lead_time_days' => 'integer'
    ];

    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function enquiries(): HasMany
    {
        return $this->hasMany(Enquiry::class);
    }
}
