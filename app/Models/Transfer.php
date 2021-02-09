<?php

namespace App\Models;

use App\Models\CommissionPayment;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class Transfer extends Model
{
    protected $table = 'transfers';

    public function commissionPayments()
    {
    	return $this->hasMany(CommissionPayment::class);
    }

    public function userLicense()
    {
    	return $this->hasOne(UserLicense::class);
    }

    public static function generateSIDSkrillBuyLicense(License $license, $data)
    {
    	//Si la licencia y el proucto estan activos y el usuario no tiene activa 
        //una licencia paga para el mismo producto
    	if($license->state == 'Active' && $license->product->state == 'Active' && ($license->product->name == 'TrSoft/Copy Binary' && !Auth::user()->paidProduct(env('BINARY_COPY_ID')) && !Auth::user()->activeProductWithPayment(env('BINARY_COPY_ID')))){
    		$transfer = Transfer::generateTransferObject($license->id);

            $commissions_pending_payment = Auth::user()->commissionsPendingPaymentValue(true);

    		$data_send = [
	    		'pay_to_email' => env('SKRILL_EMAIL'),
	    		'logo_url' => url('images/logo_icon/logo_xs.png'),
	    		'return_url' => url('process-payment/license'),
	    		'cancel_url' => url('product'),
	    		'status_url' => url('api/v1/service/p-p-2020'),
	    		'language' => $data['language'],
	    		'amount' => $license->lastPrice()->price + $commissions_pending_payment,
	    		'currency' => 'USD',
	    		'detail1_description' => $license->product->name.($commissions_pending_payment?(' + '.__('messages.commissions_pending_payment')):''),
	    		'detail1_text' => $license->name,
	    		'prepare_only' => 1,
	    		'transaction_id' => $transfer->identifier
	    	];

	    	$client = new Client();

	    	$res = $client->request('POST', env('SKRILL_PAY_URL'), [
	    		'headers' => [
	    			'Content-Type' => 'application/x-www-form-urlencoded'
	    		],
	    		'form_params' => $data_send
	    	]);

	    	if($res->getStatusCode() == 200){
		    	return $res->getBody()->getContents();
		    }
    	}

    	return false;
    }

    public static function generatePayUBuyLicense(License $license, $data)
    {
        //Si la licencia y el proucto estan activos y el usuario no tiene activa 
        //una licencia paga para el mismo producto
        if($license->state == 'Active' && $license->product->state == 'Active' && ($license->product->name == 'TrSoft/Copy Binary' && !Auth::user()->paidProduct(env('BINARY_COPY_ID')) && !Auth::user()->activeProductWithPayment(env('BINARY_COPY_ID')))){
            $transfer = Transfer::generateTransferObject($license->id, 1);

            $commissions_pending_payment = Auth::user()->commissionsPendingPaymentValue(true);

            $amount = $license->licensePrices()->orderBy('id', 'DESC')->first()->price + $commissions_pending_payment;

            $str_hash = env('PAYU_APIKEY').'~'.env('PAYU_MERCHANT_ID').'~'.$transfer->identifier.'~'.$amount.'~USD';

            $data_send = [
                'merchantId' => env('PAYU_MERCHANT_ID'),
                'ApiKey' => env('PAYU_APIKEY'),
                'accountId' => env('PAYU_ACCOUNT_ID'),
                'description' => $license->product->name.': '.$license->name.($commissions_pending_payment?(' + '.__('messages.commissions_pending_payment')):''),
                'referenceCode' => $transfer->identifier,
                'amount' => $amount,
                'tax' => null,
                'taxReturnBase' => '0',
                'signature' => md5($str_hash),
                'currency' => 'USD',
                'test' => '0',
                'lng' => $data['language'],
                'responseUrl' => url('process-payment/license'),
                'confirmationUrl' => url('api/v1/service/p-p-2020'),
                'buyerFullName' => Auth::user()->name,
                'buyerEmail' => Auth::user()->email
            ];

            $client = new Client();

            $res = $client->request('POST', env('PAYU_URL'), [
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ],
                'allow_redirects'  =>  false,
                'form_params' => $data_send
            ]);

            return $res;
        }

        return false;
    }

    public static function generateSIDSkrillPayCommission(CommissionPayment $commission_payment, $data)
    {
        //Si la comisión está pendiente de pago
        if($commission_payment->state == 'outstanding'){
            $transfer = Transfer::generateTransferObject($commission_payment->id);

            $data_send = [
                'pay_to_email' => env('SKRILL_EMAIL'),
                'logo_url' => url('images/logo_icon/logo_xs.png'),
                'return_url' => url('process-payment/commission'),
                'cancel_url' => url('commission'),
                'status_url' => url('api/v1/commission/p-p-2020'),
                'language' => $data['language'],
                'amount' => $commission_payment->value,
                'currency' => 'USD',
                'detail1_description' => __('messages.commission'),
                'detail1_text' => $commission_payment->userLicense->commission->license->product->name.' / '.$commission_payment->userLicense->commission->license->name,
                'prepare_only' => 1,
                'transaction_id' => $transfer->identifier
            ];

            $client = new Client();

            $res = $client->request('POST', env('SKRILL_PAY_URL'), [
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ],
                'form_params' => $data_send
            ]);

            if($res->getStatusCode() == 200){
                return $res->getBody()->getContents();
            }
        }

        return false;
    }

    public static function generatePayUCommission(CommissionPayment $commission_payment, $data)
    {
        if($commission_payment->state == 'outstanding'){
            $transfer = Transfer::generateTransferObject($commission_payment->id, 1);

            $amount = $commission_payment->value;

            $str_hash = env('PAYU_APIKEY').'~'.env('PAYU_MERCHANT_ID').'~'.$transfer->identifier.'~'.$amount.'~USD';

            $data_send = [
                'merchantId' => env('PAYU_MERCHANT_ID'),
                'ApiKey' => env('PAYU_APIKEY'),
                'accountId' => env('PAYU_ACCOUNT_ID'),
                'description' => $commission_payment->userLicense->commission->license->product->name.' / '.$commission_payment->userLicense->commission->license->name,
                'referenceCode' => $transfer->identifier,
                'amount' => $amount,
                'tax' => null,
                'taxReturnBase' => '0',
                'signature' => md5($str_hash),
                'currency' => 'USD',
                'test' => '0',
                'lng' => $data['language'],
                'responseUrl' => url('process-payment/commission'),
                'confirmationUrl' => url('api/v1/commission/p-p-2020'),
                'buyerFullName' => Auth::user()->name,
                'buyerEmail' => Auth::user()->email
            ];

            $client = new Client();

            $res = $client->request('POST', env('PAYU_URL'), [
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ],
                'allow_redirects'  =>  false,
                'form_params' => $data_send
            ]);

            return $res;
        }

        return false;
    }

    /**
     * Crea, almacena y retorna un nuevo objeto transfer con su respectivo identificador de transferencia
     * @return [type] [description]
     */
    public static function generateTransferObject($add_identifier = null, $bloks = 3)
    {
    	$transfer = new Transfer();
    	//Estado por defecto para identificar que la transacción sólo 
    	//ha llegado a su registro
    	$transfer->state = 'generated_by_trsoft';
    	$transfer->save();

    	$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ1234567890';

    	$chars_length = strlen($chars);

    	$text = '$';

        $blok_length = 14;

        for ($i_=0; $i_ < $bloks; $i_++) { 
            for ($i=0; $i < $blok_length; $i++) { 
                $text .= $chars[(rand(0, ($chars_length-1)))];
            }
            $text .= $transfer->id;
        }

        $transfer->identifier = $text.($add_identifier?'L'.$add_identifier:'');
    	$transfer->user_id = Auth::check()?Auth::user()->id:null;
    	$transfer->save();

    	return $transfer;
    }
}
