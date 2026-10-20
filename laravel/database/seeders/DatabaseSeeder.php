<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Enquiry;
use App\Models\Quotation;
use App\Models\Order;
use App\Models\AuditLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin
        $admin = User::create([
            'name' => 'Vikram Malhotra',
            'email' => 'admin@bharattrade.in',
            'phone' => '+91 98201 11223',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'business_name' => 'BharatTrade Marketplace HQ',
            'business_type' => 'Trader',
            'city' => 'New Delhi',
            'state' => 'Delhi',
            'verification_status' => 'verified',
            'trust_score' => 99,
        ]);

        // 2. Cloth & Textile Manufacturers
        $suratMill = User::create([
            'name' => 'Dharmesh Kapadia',
            'email' => 'sales@surattexfab.com',
            'phone' => '+91 98251 77665',
            'password' => Hash::make('password123'),
            'role' => 'manufacturer',
            'business_name' => 'Surat TexFab Mills Pvt. Ltd.',
            'business_type' => 'Manufacturer',
            'city' => 'Surat',
            'state' => 'Gujarat',
            'gstin' => '24AAACS7890D1Z4',
            'pan_number' => 'AAACS7890D',
            'verification_status' => 'verified',
            'year_established' => 2005,
            'annual_turnover' => '₹75 - 100 Cr',
            'employee_count' => '450+ Weavers',
            'trust_score' => 98,
        ]);

        $tirupurKnit = User::create([
            'name' => 'Murugan Chettiar',
            'email' => 'exports@tirupurknitwear.in',
            'phone' => '+91 98422 44556',
            'password' => Hash::make('password123'),
            'role' => 'manufacturer',
            'business_name' => 'Tirupur Knitwear & Garment Exports',
            'business_type' => 'Manufacturer',
            'city' => 'Tirupur',
            'state' => 'Tamil Nadu',
            'gstin' => '33AAACT4567P1Z1',
            'pan_number' => 'AAACT4567P',
            'verification_status' => 'verified',
            'year_established' => 2010,
            'annual_turnover' => '₹40 - 60 Cr',
            'employee_count' => '280+ Workers',
            'trust_score' => 97,
        ]);

        $jaipurPrints = User::create([
            'name' => 'Sunita Shekhawat',
            'email' => 'info@jaipurroyalprints.com',
            'phone' => '+91 98290 88990',
            'password' => Hash::make('password123'),
            'role' => 'manufacturer',
            'business_name' => 'Jaipur Royal Prints & Cotton Mills',
            'business_type' => 'Manufacturer',
            'city' => 'Jaipur',
            'state' => 'Rajasthan',
            'gstin' => '08AAACJ1234E1Z9',
            'pan_number' => 'AAACJ1234E',
            'verification_status' => 'verified',
            'year_established' => 2014,
            'annual_turnover' => '₹20 - 35 Cr',
            'employee_count' => '120 Artisans',
            'trust_score' => 96,
        ]);

        // 3. Retailer User
        $delhiRetailer = User::create([
            'name' => 'Kavita Singhal',
            'email' => 'kavita@singhalapparel.com',
            'phone' => '+91 98100 22334',
            'password' => Hash::make('password123'),
            'role' => 'retailer',
            'business_name' => 'Singhal Garments & Fabric Retailers',
            'business_type' => 'Retailer',
            'city' => 'New Delhi',
            'state' => 'Delhi',
            'gstin' => '07AABCS5544N1Z6',
            'verification_status' => 'verified',
            'trust_score' => 94,
        ]);

        // Seed Cloth Products
        Product::create([
            'user_id' => $tirupurKnit->id,
            'name' => '100% Combed Bio-Washed Cotton Single Jersey Knitted Fabric (180 GSM)',
            'slug' => '100-combed-cotton-bio-washed-single-jersey-fabric-180gsm',
            'category' => 'Textiles, Fabrics & Garments',
            'subcategory' => 'Cotton Fabrics & Greige Cloth',
            'sku' => 'TIR-FAB-BIO-180',
            'brand' => 'Tirupur Cotton Tech',
            'unit' => 'Kg',
            'moq' => 100,
            'base_price' => 380.00,
            'available_quantity' => 8500,
            'lead_time_days' => 5,
            'description' => 'Premium circular knitted 100% combed cotton jersey fabric processed with enzyme bio-wash for ultra-smooth hand-feel and zero pilling.',
            'images' => ['https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80'],
            'price_tiers' => [
                ['minQuantity' => 100, 'maxQuantity' => 299, 'unitPrice' => 380],
                ['minQuantity' => 300, 'maxQuantity' => 999, 'unitPrice' => 355],
                ['minQuantity' => 1000, 'unitPrice' => 330]
            ],
            'specifications' => [
                ['key' => 'Material Composition', 'value' => '100% Super-Combed Cotton'],
                ['key' => 'Fabric Weight', 'value' => '180 GSM'],
                ['key' => 'Width', 'value' => '60 Inches Tubular']
            ],
            'status' => 'published',
            'is_featured' => true,
            'sample_available' => true,
        ]);

        Product::create([
            'user_id' => $suratMill->id,
            'name' => 'Surat Jacquard Border Banarasi Art Silk Saree with Blouse Piece',
            'slug' => 'surat-jacquard-banarasi-art-silk-saree-wholesale',
            'category' => 'Textiles, Fabrics & Garments',
            'subcategory' => 'Surat Art Silk & Georgette Sarees',
            'sku' => 'SRT-BAN-SILK-2026',
            'brand' => 'Surat Silks',
            'unit' => 'Piece',
            'moq' => 20,
            'base_price' => 650.00,
            'available_quantity' => 2400,
            'lead_time_days' => 4,
            'description' => 'Direct Surat mill wholesale collection of rich woven Kanjivaram-style Banarasi Art Silk Sarees with metallic gold Zari work.',
            'images' => ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
            'price_tiers' => [
                ['minQuantity' => 20, 'maxQuantity' => 49, 'unitPrice' => 650],
                ['minQuantity' => 50, 'maxQuantity' => 199, 'unitPrice' => 580],
                ['minQuantity' => 200, 'unitPrice' => 520]
            ],
            'specifications' => [
                ['key' => 'Fabric', 'value' => 'Premium Art Silk Jacquard'],
                ['key' => 'Length', 'value' => '6.30 Meters (with Blouse)']
            ],
            'status' => 'published',
            'is_featured' => true,
            'sample_available' => true,
        ]);

        // Seed Audit Log
        AuditLog::create([
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'action' => 'USER_VERIFICATION_APPROVED',
            'target_user_id' => $suratMill->id,
            'target_user_name' => $suratMill->business_name,
            'details' => 'Verified Surat powerloom plant GSTIN 24AAACS7890D1Z4 and manufacturing compliance.',
            'ip_address' => '103.21.244.18',
        ]);
    }
}
