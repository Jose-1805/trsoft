<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class UserLicense extends Model
{
    protected $table = 'user_licenses';

    public function commission()
    {
    	return $this->belongsTo(Commission::class);
    }

    public function licensePrice()
    {
    	return $this->belongsTo(LicensePrice::class);
    }

    public function user()
    {
    	return $this->belongsTo(User::class);
    }

    public function commissionPayment()
    {
        return $this->hasMany(CommissionPayment::class);
    }

    public function options()
    {
        return $this->hasMany(Option::class);
    }

    public function tradersPerformance()
    {
        return $this->hasMany(TraderPerformance::class);
    }

    public function transfer()
    {
        return $this->belongTo(Transfer::class);
    }

    /**
     * Calcula el valor de la comisión y rendimiento para la licencia actual
     * @return [type] [description]
     */
    public function getCommissionData()
    {
        $commission_data = $this->commission;

        //Rendimiento generado por las operciones que aún no han pagado comisión
        $performance = $this->options()
            ->where('is_demo', -1)
            ->where('commission_paid', -1)
            ->sum('profit_value');

        $data = [
            'performance' => floatval(number_format($performance, 2, '.', '')),
            'commission' => 0
        ];

        //Si la licencia no tiene valor para calcular comision
        if(!$commission_data->value)return $data;

        if($performance){
            $data['commission'] = floatval(number_format(($performance * $commission_data->value) / 100, 2, '.', ''));
        }

        $data['commission'] = $data['commission'] < 0?0:$data['commission'];

        return $data;
    }

    /**
     * Evalua si una licencia a alcanzado el rendimiento para generar comisión
     * Si es el caso, se genera la comision (Mientras no se pague no se puede usar el producto relacionado)
     */
    public function evaluateForCommission()
    {
        $commission_data = $this->getCommissionData();
        //Si el rendimiento actual de la licencia alcanzó el tope se genera comisión
        if($commission_data['performance'] > 0 && $commission_data['performance'] >= $this->commission->performance){
            //SE desactiva el producto
            $product_setting = $this->user->getProductSetting($this->commission->license->product_id);
            $product_setting->is_active = -1;
            $product_setting->save();

            //Se almacena la respectiva comisión
            $commission = new CommissionPayment();

            $commission->value = $commission_data['commission'];
            $commission->performance = $commission_data['performance'];
            $commission->state = 'outstanding';
            $commission->payment_date = null;
            $commission->user_license_id = $this->id;
            $commission->save();

            //se genera la comisión de los traders
            $this->generateTradersCommission($commission);

            //Se marcan las opciones como pagas porque ya quedan agrupadas en la comision
            Option::payCommissions($this->id);
        }
    }

    /**
     * Genera las comisiones para los traders
     * se utiliza cuando se genera la comisión para un cliente
     */
    public function generateTradersCommission(CommissionPayment $commission_payment)
    {
        /*$traders_performance = $this->tradersPerformance()->whereNull('commission_payment_id')->get();
        
        foreach ($traders_performance as $tr_perf) {
            $tr_perf->commission_payment_id = $commission_payment->id;

        }*/
    }
}
