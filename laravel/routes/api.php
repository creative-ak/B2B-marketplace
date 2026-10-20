<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes - BharatTrade B2B Marketplace
|--------------------------------------------------------------------------
*/

// Fast Real-Time Suggestions for Autocomplete Components
Route::get('/search-suggestions', [ProductController::class, 'suggestions']);

// Products API
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Current Authenticated User
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
