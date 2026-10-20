<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\EnquiryController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ImpersonationController;
use App\Http\Controllers\Manufacturer\ManufacturerController;
use App\Http\Controllers\Retailer\RetailerController;

/*
|--------------------------------------------------------------------------
| Web Routes - BharatTrade B2B Marketplace (Hybrid Blade + Vue 3)
|--------------------------------------------------------------------------
*/

// Public Storefront & Discovery
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/categories', [HomeController::class, 'categories'])->name('categories.index');

// Enquiries & RFQ Submission
Route::post('/enquiries', [EnquiryController::class, 'store'])->name('enquiries.store');
Route::post('/enquiries/{enquiry}/messages', [EnquiryController::class, 'sendMessage'])->name('enquiries.messages.store');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    // Admin Impersonation ("Login-As") Flow
    Route::post('/admin/impersonate/{user}', [ImpersonationController::class, 'start'])->name('admin.impersonate.start');
    Route::post('/admin/impersonate/restore', [ImpersonationController::class, 'restore'])->name('admin.impersonate.restore');

    // Super Admin Dashboard & Governance
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
        Route::post('/users/{user}/verify', [AdminController::class, 'verifyUser'])->name('users.verify');
        Route::post('/users/{user}/suspend', [AdminController::class, 'toggleSuspension'])->name('users.suspend');
        Route::post('/products/{product}/moderate', [AdminController::class, 'moderateProduct'])->name('products.moderate');
        Route::get('/audit-logs/export', [AdminController::class, 'exportAuditLogs'])->name('audit.export');
    });

    // Manufacturer Dashboard
    Route::prefix('manufacturer')->name('manufacturer.')->group(function () {
        Route::get('/dashboard', [ManufacturerController::class, 'index'])->name('dashboard');
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        Route::post('/quotations', [QuotationController::class, 'store'])->name('quotations.store');
        Route::post('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status.update');
    });

    // Retailer / Buyer Dashboard
    Route::prefix('retailer')->name('retailer.')->group(function () {
        Route::get('/dashboard', [RetailerController::class, 'index'])->name('dashboard');
        Route::post('/quotations/{quotation}/accept', [QuotationController::class, 'accept'])->name('quotations.accept');
        Route::post('/quotations/{quotation}/reject', [QuotationController::class, 'reject'])->name('quotations.reject');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    });
});
