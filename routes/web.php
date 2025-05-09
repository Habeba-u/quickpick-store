<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AdminDashboardController;

Route::get('/products', [ProductController::class, 'index']);

Route::get('/static/{path}', function ($path) {
    $filePath = public_path('static/' . $path);
    if (file_exists($filePath)) {
        return response()->file($filePath);
    }
    abort(404);
})->where('path', '.*');

Route::get('/admin/login', function () {
    return response(file_get_contents(public_path('index.html')), 200)
        ->header('Content-Type', 'text/html');
})->name('admin.login');

Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard')->middleware('admin');
});

Route::get('/', function () {
    return response(file_get_contents(public_path('index.html')), 200)
        ->header('Content-Type', 'text/html');
});

Route::get('/{any}', function () {
    return response(file_get_contents(public_path('index.html')), 200)
        ->header('Content-Type', 'text/html');
})->where('any', '^(?!api).*$');
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/categories', [AdminDashboardController::class, 'index'])->name('admin.categories');
    Route::get('/admin/categories/create', [AdminDashboardController::class, 'index'])->name('admin.categories.create');
    Route::get('/admin/categories/edit/{id}', [AdminDashboardController::class, 'index'])->name('admin.categories.edit');
    Route::get('/admin/products', [AdminDashboardController::class, 'index'])->name('admin.products');
    Route::get('/admin/products/create', [AdminDashboardController::class, 'index'])->name('admin.products.create');
    Route::get('/admin/products/edit/{id}', [AdminDashboardController::class, 'index'])->name('admin.products.edit');
    Route::get('/admin/users', [AdminDashboardController::class, 'index'])->name('admin.users');
    Route::get('/admin/orders', [AdminDashboardController::class, 'index'])->name('admin.orders');
    Route::get('/admin/orders/{id}', [AdminDashboardController::class, 'index'])->name('admin.orders.show');
});
