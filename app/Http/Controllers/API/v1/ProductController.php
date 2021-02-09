<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\Income;
use App\Models\License;
use App\Models\Option;
use App\Models\Product;
use App\Models\Transfer;
use App\Models\UserLicense;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function list(Request $request)
    {
    	return Product::with([
    		'licenses', 
    		'licenses.licensePrices' => function($query){
    			$query->orderBy('id', 'DESC');
    		}, 
    		'licenses.commissions' => function($query){
    			$query->orderBy('id', 'DESC');
    		}
    	])
    	->where('products.state', 'Active')
    	->get();
    }

    /**
     * Genera un identificador de session para pago por skrill
     * para un producto
     */
    public function paySID(Request $request)
    {
        $license = License::where('state', 'Active')->find($request->license);

        //Si la licencia existe y no es una licencia gratuita
        if($license && $license->lastPrice()->price > 0){
            $sid = Transfer::generateSIDSkrillBuyLicense($license, ['language' => $request->cookie('lang')?$request->cookie('lang'):'es']);

            if($sid)
                return response(['sid' => $sid], 200);
        }

        return response(['sid' => false], 200);
    }

    /**
     * Genera la url de pago por PayU
     */
    public function payuRequest(Request $request, $license)
    {
        $license = License::where('state', 'Active')->find($license);

        //Si la licencia existe y no es una licencia gratuita
        if($license && $license->lastPrice()->price > 0){
            return Transfer::generatePayUBuyLicense($license, ['language' => $request->cookie('lang')?$request->cookie('lang'):'es']);
        }
    }

    /**
     * Procesa un pago de una licencia en el sistema
     */
    public function processPayment(Request $request)
    {
        $data = [];
        $str_ = '';
        $payment_gateway = null;
        //Si se esta procesando pago por skrill
        if($request->has('transaction_id') && $request->has('status') && $request->has('md5sig') && $request->has('mb_amount') && $request->has('mb_currency') && $request->has('merchant_id') && $request->status == '2'){
            $payment_gateway = 'skrill';
            //Datos para hash
            $str_hash = $request->merchant_id.$request->transaction_id.strtoupper(md5(env('SKRILL_SECRET_WORD'))).$request->mb_amount.$request->mb_currency.$request->status;

            //Si el dato que llega como hash es igual al md5($str_hash) que se calcula
            if($request->md5sig == strtoupper(md5($str_hash)))
                $data = explode('L', $request->transaction_id);

        //Si se está procesando pago por PayU
        }else if($request->has('reference_sale') && $request->has('merchant_id') && $request->has('value') && $request->has('sign') && $request->has('currency') && $request->has('state_pol')){
            $payment_gateway = 'payu';
            $str_ .= '*';
            if($request->state_pol == '4'){
                $str_ .= '*';
                $new_value = $request->value;

                $data_value = explode('.', $request->value);

                if(count($data_value) == 2){
                    //Si tiene dos decimales y el ultimo es 0
                    if(strlen($data_value[1]) == 2 && strval($data_value[1])[1] == '0'){
                        $new_value = $data_value[0].'.'.strval($data_value[1])[0];
                    }
                }

                $str_hash = env('PAYU_APIKEY').'~'.$request->merchant_id.'~'.$request->reference_sale.'~'.$new_value.'~'.$request->currency.'~'.$request->state_pol;

                //los datos son validos
                if($request->sign == md5($str_hash)
                    || $request->sign == sha1($str_hash)
                    || $request->sign == hash('sha256', $str_hash)
                ){           
                    $str_ .= '*';
                    $data = explode('L', $request->reference_sale);
                }
            }else{
                $transfer = Transfer::where('identifier', $request->reference_sale)
                    //->where('state', 'generated_by_trsoft')
                    ->first();

                if($transfer){
                    $transfer->state = $request->state_pol.' - '.$request->response_code_pol.' - '.$request->response_message_pol;
                    $transfer->save();
                }

                return response(['success' => true], 200);
            }
        }

        if(count($data) == 2){
            $str_ .= '*';
            $license = License::with([
                        'commissions' => function($query){
                            $query->orderBy('id', 'DESC');
                        }, 
                        'licensePrices' => function($query){
                            $query->orderBy('id', 'DESC');
                        }
                    ])
                    ->where('licenses.id', $data[1])
                    ->first();

            $transfer = Transfer::where('identifier', $data[0].'L'.$data[1])
                    //->where('state', 'generated_by_trsoft')
                    ->first();

        	if($license && $transfer){
                $str_ .= '*';
    			$user_license = new UserLicense();
    			$user_license->user_id = $transfer->user_id;
    			$user_license->commission_id = $license->commissions[0]->id;
    			$user_license->license_price_id = $license->licensePrices[0]->id;
                $user_license->transfer_id = $transfer->id;

    			$user_license->save();

                //Se marcan como pagas todas las operaciones que no se hayan agrupado
                //en una comission
                Option::payCommissions($transfer->user_id);

                $transfer->state = 'processed';
                $transfer->save();

                //Todos los pagos se realizan en dolares pero se
                //pasan a pesos colombianos
                $currency = Currency::where('name', 'USD')->first();

                $income = new Income();
                $income->type = 'license';
                $income->value = $request->value;
                $income->exchange_rate_cop = $request->exchange_rate;
                $income->payment_gateway = $payment_gateway;
                $income->transfer_id = $transfer->id;
                $income->currency_id = $currency->id;
                $income->save();

                //Se generan los egresos relacionados al ingreso actual
                $income->generateExpenses();

    			return response(['success' => true], 200);
        	}
        }

    	return response(['error' => ['invalid_data '.$str_]], 422);
    }

    /**
     * Asigna un valor de configuración para copy binary
     */
    public function setSettingCopyBinary(Request $request)
    {   //Se han enviado los datos correctos
        if($request->has('item') && $request->has('value')

             && (
                //Solo se puede cambiar el estado cuando el usuario tiene ssid y no hay comisiones pendientes de pago
                ($request->item == 'is_active' && $request->user()->ssid && !$request->user()->commissionsPendingPaymentValue())
                //Las configuraciones diferentes de is_active siempre se pueden editar
                || $request->item != 'is_active'
            )
         ){
            $product_setting = $request->user()->getProductSetting(env('BINARY_COPY_ID'));

            if($product_setting){
                $error = false;
                switch ($request->item) {
                    case 'amount':
                        if($request->value > $product_setting->max_amount)
                            $error = true;
                        break;
                    case 'stop_loss_value':
                        if($request->value < $product_setting->amount)
                            $error = true;
                        break;
                    default:
                        break;
                }

                if(!$error){
                    try{
                        $last_state = $product_setting->is_active;

                        $product_setting[$request->item] = $request->value;

                        if($product_setting->stop_loss == 1 && !$product_setting->stop_loss_value){
                            $product_setting->stop_loss_value = $product_setting->allow_increment == 1?25:5;
                        }

                        $product_setting->save();

                        return response(['success' => true], 200);
                    }catch (Exception $e){
                        return response(['errors' => ['invalid_data']], 422);
                    }
                }
            }
        }
        return response(['errors' => ['invalid_data']], 422);
    }
}
