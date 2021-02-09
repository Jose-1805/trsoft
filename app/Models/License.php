<?php

namespace App\Models;

use App\Models\Option;
use App\Models\ProductSetting;
use Illuminate\Database\Eloquent\Model;

class License extends Model
{
    protected $table = 'licenses';

    public $timestamps = false;
 
    public function licensePrices()
    {
    	return $this->hasMany(LicensePrice::class);
    }

    public function Commissions()
    {
    	return $this->hasMany(Commission::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function lastPrice()
    {
        return $this->licensePrices()->orderBy('license_prices.id', 'DESC')->first();
    }

    public function lastCommission()
    {
        return $this->Commissions()->orderBy('commissions.id', 'DESC')->first();
    }

    /**
     * Finaliza las licencias que han expirado y genera las comisiones correspondientes
     */
    public static function evaluateLicenses()
    {   
        $licenses = UserLicense::where('expiration_date', '<=', date('Y-m-d H:i:s'))
        ->where('state', 'Active')->get();

        foreach ($licenses as $key => $license) {
            $license->state = 'Inactive';
            $license->save();

            $commission_data = $license->getCommissionData();
            $user = $license->user;

            //De acuerdo al producto se restablece el max_amount
            if($license->commission->license->product->name == 'TrSoft/Copy Binary'){
                //Se busca la ultima licencia gratis del producto
                $license_product = License::select('licenses.*')
                ->join('products', 'licenses.product_id', '=', 'products.id')
                ->join('license_prices', 'licenses.id', '=', 'license_prices.license_id')
                ->where('products.state', 'Active')
                ->where('products.name', 'TrSoft/Copy Binary')
                ->where('licenses.state', 'Active')
                ->where('licenses.duration', -1)
                ->where('license_prices.price', 0)
                ->orderBy('licenses.id', 'DESC')
                ->first();

                if($license_product){
                    $product_setting = $user->getProductSetting($license_product->product_id);

                    if(!$product_setting){
                        $product_setting = new ProductSetting();
                        $product_setting->user_id = $this->id;
                        $product_setting->product_id = $license_product->product_id;
                    }

                    $product_setting->amount = 1;//$license_product->max_amount;
                    $product_setting->max_amount = $license_product->max_amount;

                    //Si la comisión queda pendiente de pago se desactiva el producto
                    if($commission_data['commission'] > 0)
                        $product_setting->is_active = -1;

                    $product_setting->save();
                }
            }

            //Se almacena la respectiva comisión
            $commission = new CommissionPayment();

            $commission->value = $commission_data['commission'];
            $commission->performance = $commission_data['performance'];
            $commission->state = $commission_data['commission'] > 0?'outstanding':'paid';
            $commission->payment_date = $commission_data['commission'] > 0?null:date('Y-m-d H:i:s');
            $commission->user_license_id = $license->id;
            $commission->save();

            //Se marcan las opciones como pagas porque ya quedan agrupadas en la comision
            Option::payCommissions($user->id);
        }
    }
}
