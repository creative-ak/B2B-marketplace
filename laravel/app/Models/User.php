<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role', // 'admin', 'manufacturer', 'retailer'
        'business_name',
        'business_type',
        'city',
        'state',
        'gstin',
        'pan_number',
        'verification_status', // 'pending', 'verified', 'rejected'
        'year_established',
        'annual_turnover',
        'employee_count',
        'trust_score',
        'is_suspended'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_suspended' => 'boolean',
        'trust_score' => 'integer',
        'year_established' => 'integer'
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function sentEnquiries(): HasMany
    {
        return $this->hasMany(Enquiry::class, 'retailer_id');
    }

    public function quotations(): HasMany
    {
        return $this->hasMany(Quotation::class, 'manufacturer_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'retailer_id');
    }

    public function isManufacturer(): bool
    {
        return $this->role === 'manufacturer';
    }

    public function isRetailer(): bool
    {
        return $this->role === 'retailer';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
