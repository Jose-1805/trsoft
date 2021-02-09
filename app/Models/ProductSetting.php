<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Model;

class ProductSetting extends Model
{
    protected $table = 'product_settings';

    protected $fillable = [
        'is_active', 'use_practice_account', 'max_amount', 'amount', 'stop_loss', 'stop_loss_value', 'dynamic_stop_loss', 'user_id', 'product_id', 'operations', 'current_balance', 'higher_balance', 'activation_date'
    ];

    public function product()
    {
    	return $this->belongsTo(Product::class);
    }

    public function user()
    {
    	return $this->belongsTo(User::class);
    }
}
