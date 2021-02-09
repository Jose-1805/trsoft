<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\ProductSetting;
use Illuminate\Http\Request;

class LicenseController extends Controller
{
    public function list(Request $request)
    {
    	return $request->user()->getLicenses();
    }

    public function activate(Request $request)
    {
    	if($request->has('user_license')){
    		$license = $request->user()->userLicenses()->where('id', $request->user_license)->first();
            $user = $request->user();
            //Existe la licencia y no existe una licencia paga activa para el producto relacionado
    		if($license && ($license->commission->license->product->name == 'TrSoft/Copy Binary' && !$user->activeProductWithPayment(env('BINARY_COPY_ID')))){
    			//El estado de la licencia permite su activación
    			if($license->state == 'Paid'){
    				//El producto relacionado con la licencia se encuentra activo con una licencia paga
    				$product = $request->user()->activeProductWithPayment($license->commission->license->product->id);

    				if(!$product){
                        $activation_date = date('Y-m-d H:i:s');
                        $expiration_date = date('Y-m-d H', strtotime('+'.$license->commission->license->duration.'months', strtotime($activation_date))).':00:00';
                        $expiration_date = date('Y-m-d H:i:s', strtotime('+1hours', strtotime($expiration_date)));

    					$license->activation_date = $activation_date;
    					$license->expiration_date = $expiration_date;
    					$license->state = 'Active';
    					$license->save();

                        //Si el producto es copy binary se actualiza el valor máximo de inversión
                        if($license->commission->license->product->name == 'TrSoft/Copy Binary'){
                            $product_setting = $user->getProductSetting($license->commission->license->product_id);

                            if(!$product_setting){
                                $product_setting = new ProductSetting();
                                $product_setting->amount = 1;//$license->commission->license->max_amount;
                                $product_setting->user_id = $this->id;
                                $product_setting->product_id = $license->commission->license->product_id;
                            }

                            $product_setting->max_amount = $license->commission->license->max_amount;
                            $product_setting->save();
                        }

    					return response(['success' => true], 200);
    				}else{
    					return response(['error' => ['product_is_active']], 422);
    				}
    			}else{
    				return response(['error' => ['invalid_state']], 422);
    			}
    		}
    	}

    	return response(['error' => ['invalid_data']], 422);
    }
}
