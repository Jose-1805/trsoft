<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\CommissionPayment;
use App\Models\Currency;
use App\Models\Income;
use App\Models\Transfer;
use Illuminate\Http\Request;

class CommissionController extends Controller
{
    public function getUpcomingCommissions(Request $request)
    {
    	$licenses = $request->user()->userLicenses()
            ->where('state', 'Active')
            ->orderBy('user_licenses.id', 'DESC')
            ->get();

    	$data = [];

    	foreach ($licenses as $key => $license) {
    		$license->commission->license->product;
    		$license->commission_data = $license->getCommissionData();

    		$data[] = $license;
    	}

    	return response($data, 200);
    }

    public function getCommissions(Request $request, $only_outstanding = false)
    {
        return $commissions = CommissionPayment::select('commission_payments.*')->join('user_licenses','commission_payments.user_license_id', '=', 'user_licenses.id')
        ->where('user_licenses.user_id', $request->user()->id)
        ->with(['userLicense', 'userLicense.commission', 'userLicense.commission.license', 'userLicense.commission.license.product'])
        ->get();

    	$licenses = $request->user()->userLicenses()->get();

    	$data = [];

    	foreach ($licenses as $key => $license) {
    		$license->commission->license->product;
    		$license->commissionPayment;

            //Filtro, sólo las licencias requeridas
    		if(!$only_outstanding || (
    			$only_outstanding && $license->commissionPayment[0]->state == 'outstanding'
    		)){
                //Si la licencia no tiene pagos relacionados
                if(!count($license->commissionPayment)){
                    $data_commission = $license->getCommissionData();

                    $license->commissionPayment[] = [
                        'performance' => $data_commission['performance'],
                        'value' => $data_commission['commission'],
                        'performance_demo' => $data_commission['performance_demo']
                    ];
                }

    			$data[] = $license;
            }
    	}

    	return response($data, 200);
    }

    /**
     * Genera un identificador de session para pago por skrill
     * para un producto
     */
    public function paySID(Request $request)
    {
        $commission_payment = CommissionPayment::select('commission_payments.*')
            ->join('user_licenses', 'commission_payments.user_license_id', '=', 'user_licenses.id')
            ->where('commission_payments.state', 'outstanding')
            ->where('user_licenses.user_id', $request->user()->id)
            ->where('commission_payments.id', $request->commission)
            ->first();

        if($commission_payment){
            $sid = Transfer::generateSIDSkrillPayCommission($commission_payment, ['language' => $request->cookie('lang')?$request->cookie('lang'):'es']);

            if($sid)
                return response(['sid' => $sid], 200);
        }

        return response(['sid' => false], 200);
    }

    /**
     * Genera url de pago por PayU
     */
    public function payuRequest(Request $request, $commission_payment_id)
    {
        $commission_payment = CommissionPayment::select('commission_payments.*')
            ->join('user_licenses', 'commission_payments.user_license_id', '=', 'user_licenses.id')
            ->where('commission_payments.state', 'outstanding')
            ->where('user_licenses.user_id', $request->user()->id)
            ->where('commission_payments.id', $commission_payment_id)
            ->first();

        if($commission_payment){
            return Transfer::generatePayUCommission($commission_payment, ['language' => $request->cookie('lang')?$request->cookie('lang'):'es']);
        }
    }


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
            $str_ .= '*';
            $payment_gateway = 'payu';
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

            $transfer = Transfer::where('identifier', $data[0].'L'.$data[1])
                    //->where('state', 'generated_by_trsoft')
                    ->first();

            if($transfer){
                $commission = CommissionPayment::select('commission_payments.*')
                        ->join('user_licenses', 'commission_payments.user_license_id', '=', 'user_licenses.id')
                        ->where('commission_payments.id', $data[1])
                        ->where('commission_payments.state', 'outstanding')
                        ->where('user_licenses.user_id', $transfer->user_id)->first();

                if($commission && $transfer){
                    $commission->state = 'paid';
                    $commission->payment_date = date('Y-m-d H:i:s');
                    $commission->transfer_id = $transfer->id;
                    $commission->save();

                    $transfer->state = 'processed';
                    $transfer->save();

                    //Todos los pagos se realizan en dolares pero se
                    //pasan a pesos colombianos
                    $currency = Currency::where('name', 'USD')->first();

                    $income = new Income();
                    $income->type = 'commission';
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
        }

        return response(['error' => ['invalid_data '.$str_]], 422);
    }
}
