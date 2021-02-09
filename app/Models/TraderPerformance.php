<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Model;

class TraderPerformance extends Model
{
    protected $table = 'traders_performance';

    public $timestamps = false;

    protected $fillable = [
        'performance', 'Commission', 'user_id', 'user_license_id', 'commission_payment_id'
    ];

    /**
     * Trader relacionado
     */
    public function user()
    {
    	return $this->belongsTo(User::class);
    }

    /**
     * Tabla de relacion entre el cliente y la licencia
     */
    public function userLicense()
    {
    	return $this->belongsTo(UserLicense::class);
    }

    /**
     * Pago de la comision del cliente, mediante el cual 
     * se genera el egreso para pagar la comisión al trader
     */
    public function commissionPayment()
    {
    	return $this->belongsTo(CommissionPayment::class);
    }
}
