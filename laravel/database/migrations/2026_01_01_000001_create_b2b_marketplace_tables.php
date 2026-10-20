<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Users Table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'manufacturer', 'retailer'])->default('retailer');
            $table->string('business_name');
            $table->string('business_type')->default('Retailer');
            $table->string('city');
            $table->string('state');
            $table->string('gstin')->nullable()->index();
            $table->string('pan_number')->nullable();
            $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->integer('year_established')->nullable();
            $table->string('annual_turnover')->nullable();
            $table->string('employee_count')->nullable();
            $table->integer('trust_score')->default(80);
            $table->boolean('is_suspended')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });

        // Categories Table
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon_name')->default('Layers');
            $table->json('subcategories')->nullable();
            $table->timestamps();
        });

        // Products Table
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->index();
            $table->string('subcategory')->index();
            $table->string('sku')->unique();
            $table->string('brand')->nullable();
            $table->string('unit')->default('Piece');
            $table->integer('moq')->default(1);
            $table->decimal('base_price', 12, 2);
            $table->integer('available_quantity')->default(100);
            $table->integer('lead_time_days')->default(7);
            $table->text('description')->nullable();
            $table->json('specifications')->nullable();
            $table->json('price_tiers')->nullable();
            $table->json('images')->nullable();
            $table->enum('status', ['draft', 'pending_approval', 'published', 'rejected', 'suspended'])->default('published');
            $table->text('rejection_reason')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('sample_available')->default(false);
            $table->integer('views_count')->default(0);
            $table->integer('enquiries_count')->default(0);
            $table->timestamps();
        });

        // Enquiries (RFQs) Table
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('retailer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');
            $table->string('product_title');
            $table->string('product_category');
            $table->json('target_supplier_ids');
            $table->foreignId('primary_supplier_id')->constrained('users')->onDelete('cascade');
            $table->integer('quantity_required');
            $table->string('unit')->default('Piece');
            $table->decimal('target_price_per_unit', 12, 2)->nullable();
            $table->string('delivery_location');
            $table->string('delivery_pincode');
            $table->date('expected_date')->nullable();
            $table->text('specifications_summary')->nullable();
            $table->json('messages')->nullable();
            $table->enum('status', ['open', 'quoted', 'negotiating', 'closed'])->default('open');
            $table->timestamps();
        });

        // Quotations Table
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->string('quotation_number')->unique();
            $table->foreignId('enquiry_id')->constrained()->onDelete('cascade');
            $table->foreignId('manufacturer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('retailer_id')->constrained('users')->onDelete('cascade');
            $table->string('product_name');
            $table->json('items');
            $table->decimal('subtotal', 14, 2);
            $table->decimal('tax_rate', 5, 2)->default(18.00);
            $table->decimal('tax_amount', 14, 2)->default(0.00);
            $table->decimal('shipping_charges', 12, 2)->default(0.00);
            $table->decimal('grand_total', 14, 2);
            $table->string('delivery_timeline')->nullable();
            $table->string('payment_terms')->nullable();
            $table->date('valid_until')->nullable();
            $table->enum('status', ['draft', 'sent', 'under_negotiation', 'accepted', 'rejected'])->default('sent');
            $table->integer('revision_number')->default(1);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Purchase Orders Table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('quotation_id')->constrained()->onDelete('cascade');
            $table->foreignId('enquiry_id')->constrained()->onDelete('cascade');
            $table->foreignId('retailer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('manufacturer_id')->constrained('users')->onDelete('cascade');
            $table->string('product_title');
            $table->integer('quantity');
            $table->string('unit');
            $table->decimal('grand_total', 14, 2);
            $table->string('payment_terms')->nullable();
            $table->text('shipping_address');
            $table->enum('status', ['confirmed', 'in_production', 'dispatched', 'delivered', 'cancelled'])->default('confirmed');
            $table->timestamps();
        });

        // Audit Logs Table
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->string('admin_name');
            $table->string('action');
            $table->unsignedBigInteger('target_user_id')->nullable();
            $table->string('target_user_name')->nullable();
            $table->text('details');
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('quotations');
        Schema::dropIfExists('enquiries');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('users');
    }
};
