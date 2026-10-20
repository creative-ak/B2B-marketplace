<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display the public B2B marketplace homepage with Cloth & Industrial highlights.
     */
    public function home()
    {
        $categories = Category::all();

        // Cloth & Textile Featured Products
        $clothProducts = Product::where('status', 'published')
            ->where('category', 'Textiles, Fabrics & Garments')
            ->orderBy('is_featured', 'desc')
            ->take(8)
            ->get();

        // Industrial Machinery & Equipment
        $industrialProducts = Product::where('status', 'published')
            ->where('category', '!=', 'Textiles, Fabrics & Garments')
            ->take(6)
            ->get();

        // Verified Manufacturers (Surat Silk, Tirupur Knitwear, Apex, etc.)
        $manufacturers = User::where('role', 'manufacturer')
            ->where('verification_status', 'verified')
            ->where('is_suspended', false)
            ->take(6)
            ->get();

        $stats = [
            'total_products' => Product::where('status', 'published')->count(),
            'total_mills' => User::where('role', 'manufacturer')->where('verification_status', 'verified')->count(),
            'total_rfqs' => 3840,
        ];

        return view('home', compact('categories', 'clothProducts', 'industrialProducts', 'manufacturers', 'stats'));
    }

    /**
     * Browse and search catalogue with filters for categories, city, MOQ, and cloth focus.
     */
    public function index(Request $request)
    {
        $query = Product::with('user')->where('status', 'published');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('subcategory', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('business_name', 'like', "%{$search}%")
                         ->orWhere('city', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        if ($request->filled('subcategory') && $request->subcategory !== 'All') {
            $query->where('subcategory', $request->subcategory);
        }

        if ($request->filled('city') && $request->city !== 'All') {
            $query->whereHas('user', function ($uq) use ($request) {
                $uq->where('city', $request->city);
            });
        }

        if ($request->filled('verified_only') && $request->boolean('verified_only')) {
            $query->whereHas('user', function ($uq) {
                $uq->where('verification_status', 'verified');
            });
        }

        // Sorting
        $sort = $request->input('sort', 'featured');
        switch ($sort) {
            case 'price_low':
                $query->orderBy('base_price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('base_price', 'desc');
                break;
            case 'moq_low':
                $query->orderBy('moq', 'asc');
                break;
            default:
                $query->orderBy('is_featured', 'desc')->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->paginate(12)->withQueryString();
        $categories = Category::all();

        return view('products.index', compact('products', 'categories'));
    }

    /**
     * Show single product details with specifications, tiered pricing, and RFQ form.
     */
    public function show($slug)
    {
        $product = Product::with('user')->where('slug', $slug)->orWhere('id', $slug)->firstOrFail();

        // Increment view count
        $product->increment('views_count');

        $relatedProducts = Product::where('category', $product->category)
            ->where('id', '!=', $product->id)
            ->where('status', 'published')
            ->take(4)
            ->get();

        return view('products.show', compact('product', 'relatedProducts'));
    }

    /**
     * Real-time search autocomplete suggestion endpoint for Vue 3 frontend component.
     */
    public function suggestions(Request $request)
    {
        $query = trim($request->input('q', ''));

        if (empty($query)) {
            // Return top cloth & industrial items when query is empty
            $products = Product::where('status', 'published')
                ->orderByRaw("category = 'Textiles, Fabrics & Garments' DESC")
                ->take(5)
                ->get(['id', 'name', 'slug', 'category', 'base_price', 'unit', 'moq', 'images']);

            return response()->json([
                'products' => $products,
                'categories' => [],
                'manufacturers' => [],
            ]);
        }

        $products = Product::with('user:id,business_name,city')
            ->where('status', 'published')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('category', 'like', "%{$query}%")
                  ->orWhere('subcategory', 'like', "%{$query}%");
            })
            ->take(6)
            ->get();

        $matchingCategories = Category::where('name', 'like', "%{$query}%")
            ->take(3)
            ->get(['id', 'name', 'slug']);

        $matchingSuppliers = User::where('role', 'manufacturer')
            ->where('verification_status', 'verified')
            ->where(function ($q) use ($query) {
                $q->where('business_name', 'like', "%{$query}%")
                  ->orWhere('city', 'like', "%{$query}%");
            })
            ->take(3)
            ->get(['id', 'business_name', 'city', 'state', 'gstin']);

        return response()->json([
            'products' => $products,
            'categories' => $matchingCategories,
            'manufacturers' => $matchingSuppliers,
        ]);
    }
}
