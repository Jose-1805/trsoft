<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommissionPayment extends Model
{
    protected $table = 'commission_payments';

    public function transfer()
    {
    	return $this->belongTo(Transfer::class);
    }

    public function userLicense()
    {
    	return $this->belongsTo(UserLicense::class);
    }
}
