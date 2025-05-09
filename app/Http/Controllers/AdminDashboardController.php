<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return redirect('/admin/dashboard');
    }

    public function dashboardData()
{
    $totalOrders = Order::count();
    $totalRevenue = Order::sum('total');
    $activeUsers = User::whereHas('orders')->count();
    $totalUsers = User::count(); // Add total users
    $monthlySales = Order::whereMonth('created_at', Carbon::now()->month)
        ->whereYear('created_at', Carbon::now()->year)
        ->sum('total');

    $recentActivity = Order::with('user', 'items')
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get()
        ->map(function ($order) {
            return [
                'order_id' => $order->id,
                'customer' => $order->user ? "{$order->user->first_name} {$order->user->last_name}" : 'Unknown',
                'item_count' => $order->items->sum('quantity'),
                'total' => $order->total,
                'created_at' => $order->created_at->toDateTimeString(),
            ];
        });

    $salesTrends = [];
    for ($i = 6; $i >= 0; $i--) {
        $month = Carbon::now()->subMonths($i);
        $sales = Order::whereMonth('created_at', $month->month)
            ->whereYear('created_at', $month->year)
            ->sum('total');
        $salesTrends[] = $sales;
    }

    $popularProducts = OrderItem::select('product_id')
        ->groupBy('product_id')
        ->orderByRaw('SUM(quantity) DESC')
        ->take(4)
        ->with('product')
        ->get()
        ->map(function ($item) {
            return [
                'name' => $item->product->name,
                'image' => $item->product->image ? asset('storage/' . $item->product->image) : '/assets/placeholder.jpg',
            ];
        });

    return response()->json([
        'totalOrders' => $totalOrders,
        'totalRevenue' => $totalRevenue,
        'activeUsers' => $activeUsers,
        'totalUsers' => $totalUsers, // Include total users
        'monthlySales' => $monthlySales,
        'recentActivity' => $recentActivity,
        'salesTrends' => $salesTrends,
        'popularProducts' => $popularProducts,
    ]);
}
}
