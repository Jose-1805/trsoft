<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $table = 'expenses';
    public $timestamps = false;

    protected $fillable = [
        'type', 'value', 'exchange_rate_cop', 'state', 'trader_performance_id', 'income_id', 'currency_id'
    ];
}
