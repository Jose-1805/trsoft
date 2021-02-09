<?php

namespace App;

use App\Mail\RegisterVerificationCode;
use App\Models\CommissionPayment;
use App\Models\License;
use App\Models\Option;
use App\Models\ProductSetting;
use App\Models\TraderPerformance;
use App\Models\Transfer;
use App\Models\UserLicense;
use App\Models\UserStartTrading;
use GuzzleHttp\Client as GuzzleHttpClient;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'cell_phone_number', 'ssid', 'token', 'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function productSettings()
    {
        return $this->hasMany(ProductSetting::class);
    }

    public function usersStartTrading()
    {
        return $this->hasMany(UserStartTrading::class);
    }

    public function optionsTrader()
    {
        return $this->hasMany(Option::class, 'user_id');
    }

    public function userLicenses()
    {
        return $this->hasMany(UserLicense::class);
    }

    public function transfers()
    {
        return $this->hasMany(Transfer::class);
    }

    public function tradersPerformance()
    {
        return $this->hasMany(TraderPerformance::class);
    }

    public function setStartTrading()
    {
        $this->setStopTrading();

        $last_user_start_trading = new UserStartTrading();
        $last_user_start_trading->start = date('Y-m-d H:i:s');
        $last_user_start_trading->user_id = $this->id;
        $last_user_start_trading->save();
    }

    public function setStopTrading()
    {
        $last_user_start_trading_without_close = $this->usersStartTrading()->whereNull('stop')->first();
        
        if($last_user_start_trading_without_close){
            $last_user_start_trading_without_close->stop = date('Y-m-d H:i:s');
            $last_user_start_trading_without_close->save();
        }
    }

    public function addOptionTrader(Request $request)
    {
        $option = new Option();

        $option_exist = $this->optionsTrader()
        ->where('active_id', $request->active_id)
        ->where('expiration_time', $request->expiration_time)
        ->where('direction', $request->direction)
        ->first();

        if(!$option_exist){
            $option->active_id = $request->active_id;
            $option->active_name = $request->active_name;
            $option->active_image = $request->active_image;
            $option->expiration_time = $request->expiration_time;
            $option->direction = $request->direction;
            $option->user_id = $this->id;

            $option->save();
        }
    }

    /**
     * Almacena una operación para un usuario
     */
    public function addOptionClient(Request $request)
    {   
        $product_setting = $this->getProductSetting(env('BINARY_COPY_ID'));
        //Si existe configuración para el producto BInaryCopy
        if($product_setting){

            //Licencia activa para binary copy donde el importe máximo sea igual al importe máximo del usuario
            $license = $this->activeLicensesProduct(env('BINARY_COPY_ID'))->where('licenses.max_amount', $product_setting->max_amount)->first();

            if($license){
                //Ulimo inicio de sesion de trading para el usuario
                $user_start_trading = $this->usersStartTrading()->whereNull('stop')->first();

                //Se busca la operación realizada por el trader
                $parent_option = Option::where('user_id', $request->trader)
                ->where('active_id', $request->active_id)
                ->where('expiration_time', $request->expiration_time)
                ->where('direction', $request->direction)
                ->first();
                
                if($user_start_trading){
                    $option = new Option();

                    $option->option_broker_id = $request->option_broker_id;
                    $option->active_id = $request->active_id;
                    $option->active_name = $request->active_name;
                    $option->active_image = $request->active_image;
                    $option->amount = $request->amount;
                    $option->profit_percentage = $request->profit_percentage;
                    $option->level = $request->level;
                    //$option->profit_value = $request->profit_value;
                    //$option->result = $request->result;
                    $option->expiration_time = $request->expiration_time;
                    $option->direction = $request->direction;
                    //$option->is_demo = $request->is_demo;
                    $option->user_start_trading_id = $user_start_trading->id;
                    $option->parent_option_id = $parent_option?$parent_option->id:null;
                    $option->user_license_id = $license->id;
                    $option->save();

                    //Se actualizan los valores de la configuración del producto
                    $product_setting->operations++;
                    $product_setting->current_balance -= $request->amount;
                    $product_setting->save();

                    return response(['success' => true], 200);
                }else{
                    return response(['error' => ['Parent option or user_start_trading not found']], 422);
                }
            }else{
                return response(['error' => ['License not found']], 422);
            }
        }else{
            return response(['error' => ['Configuration not found']], 422);
        }
    }

    /**
     * Cuando se cierra una operación se actualizan los datos con esta funcion
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function updateOptionClient(Request $request = null, $data = null)
    {
        $option = Option::select('options.*')
        ->join('users_start_trading', 'options.user_start_trading_id', '=', 'users_start_trading.id')
        ->join('users', 'users_start_trading.user_id', '=', 'users.id')
        ->where('option_broker_id', $request->option_broker_id)
        ->whereNull('profit_value')
        ->whereNull('is_demo')
        ->whereNull('result')
        ->where('users.id', $this->id)
        ->first();
        
        if($option){
            $product_setting = $this->getProductSetting(env('BINARY_COPY_ID'));

            $option->result = $request->result;

            if($option->result == 1){
                $option->profit_value = ($option->amount * $option->profit_percentage)/100;
                //El saldo incrementa con las ganancias
                $product_setting->current_balance += $option->profit_value;

                //SI operations es mayor a 0 es porque no ha habido cambio de día durante el transcurso de la operación
                //abrió y cerro durante el mismo día, por lo cual el valor de la inversión se adiciona al saldo actual
                //ya que se resta cuando la operación abre
                if($product_setting->operations > 0){
                    $product_setting->current_balance += $option->amount;
                }

                //Si el saldo actual es mayor al saldo más alto registrado
                //se actualiza
                if($product_setting->current_balance > $product_setting->higher_balance)
                    $product_setting->higher_balance = $product_setting->current_balance;
            }else if($option->result == 0){
                //SI operations es mayor a 0 es porque no ha habido cambio de día durante el transcurso de la operación
                //abrió y cerro durante el mismo día, por lo cual el valor de la inversión se adiciona al saldo actual
                //ya que se resta cuando la operación abre
                if($product_setting->operations > 0){
                    $product_setting->current_balance += $option->amount;
                }

                $option->profit_value = 0;
            }else if($option->result == -1){
                $option->profit_value = $option->amount * -1;

                //SI operations es igual a 0 es porque ha habido cambio de día durante el transcurso de la operación
                //abrió en un dñia y cerro en otro, por lo cual el valor de la inversión se resta al saldo actual
                //ya que la pérdida se registro en el día anterior pero los datos ya no están y la perdida es del día actual
                if($product_setting->operations == 0){
                    $product_setting->current_balance -= $option->amount;
                }
            }

            //$option->is_demo = -1;
            $option->is_demo = $request->is_demo;
            $option->save();

            //Se asignan los datos de rendimiento del trader con el cliente
            $this->setDataTraderPerformance($option);

            $product_setting->save();

            $stop_loss_reached = false;
            //Si la operación fue fallida se evalua el stop loss si está habilitado
            if($option->result == -1 && $product_setting->stop_loss == 1){
                //Limite de perdida, inicialmente se es ($product_setting->stop_loss_value * -1)
                //para establecer el limite de un stop loss no dinamico
                $limit_balance = $product_setting->stop_loss_value * -1;

                //Si el stop loss es dinamico se corre el limite actual
                //hasta estar al limite del valor más alto alcanzado en el saldo
                if($product_setting->dynamic_stop_loss == 1)
                    $limit_balance += $product_setting->higher_balance;

                //El stop loss es alcanzado cuando no es posible realizar una nueva operación
                //sin llegar al limite del stop loss
                if(($product_setting->current_balance - $product_setting->amount) < $limit_balance)
                    $stop_loss_reached = true;
            }

            //Si se alcanzó el stop loss se envía la notificación para desconectar 
            //el usuario de la sesión
            if($stop_loss_reached){
                //Se establece la nueva fecha de activación
                $product_setting->activation_date = date('Y-m-d H', strtotime('+4hours')).':00:00';
                $product_setting->save();
            }

            //Si es cuenta real y la opración fue acertadase evalua si generó comision
            if($option->is_demo == -1 && $option->result == 1) {
                $option->userLicense->evaluateForCommission();
            }

            return response(['success' => true], 200);
        }else{
            return response(['error' => ['Operation not found.']], 422);
        }
    }

    public function getLicenses()
    {
        return $this->userLicenses()->orderBy('user_licenses.id', 'DESC')->with(['commission', 'licensePrice', 'commission.license', 'commission.license.product'])->get();
    }

    /**
     * Consulta los productos activos que tiene el usuario
     */
    public function activeProducts()
    {
        return $this->userLicenses()->select('products.*')
        ->join('commissions', 'user_licenses.commission_id', '=', 'commissions.id')
        ->join('licenses', 'commissions.license_id', '=', 'licenses.id')
        ->join('license_prices', 'user_licenses.license_price_id', '=', 'license_prices.id')
        ->join('products', 'licenses.product_id', '=', 'products.id')
        ->where('user_licenses.state', 'Active');
    }

    /**
     * Consulta si un producto esta activo para el usuario por medio de una licencia paga
     * @param  [type] $id_product [Id del producto]
     * @return [Boolean]
     */
    public function activeProductWithPayment($id_product)
    {
        $product = $this->activeProducts()
        ->where('products.id', $id_product)
        ->where('license_prices.price', '>', 0)->first();
        return $product?true:false;
    }

    /**
     * Consulta si un producto esta pago para el usuario por medio de una licencia paga
     * @param  [type] $id_product [Id del producto]
     * @return [Boolean]
     */
    public function paidProduct($id_product)
    {
        $product = $this->userLicenses()->select('products.*')
        ->join('commissions', 'user_licenses.commission_id', '=', 'commissions.id')
        ->join('licenses', 'commissions.license_id', '=', 'licenses.id')
        ->join('license_prices', 'user_licenses.license_price_id', '=', 'license_prices.id')
        ->join('products', 'licenses.product_id', '=', 'products.id')
        ->where(function($q){
            $q->where('user_licenses.state', 'Active')
            ->orWhere('user_licenses.state', 'Paid');
        })
        ->where('products.id', $id_product)
        ->where('license_prices.price', '>', 0)->first();

        return $product?true:false;
    }

    /**
     * Consulta la licencia activa para un producto
     */
    public function activeLicensesProduct($id_product)
    {
        return $this->userLicenses()->select('user_licenses.*')
        ->join('commissions', 'user_licenses.commission_id', '=', 'commissions.id')
        ->join('licenses', 'commissions.license_id', '=', 'licenses.id')
        ->join('products', 'licenses.product_id', '=', 'products.id')
        ->where('user_licenses.state', 'Active')
        ->where('products.id', $id_product);
    }

    public function commissionsPendingPayment()
    {
        return CommissionPayment::join('user_licenses', 'commission_payments.user_license_id', '=', 'user_licenses.id')
        ->where('commission_payments.state', 'outstanding')
        ->where('user_licenses.user_id', $this->id)->get();
    }

    /**
     * Calcula el valor de las comisiones pendientes de pago
     */
    public function commissionsPendingPaymentValue($full = false)
    {
        //Valor por comisiones ya generadas
        $commission_pending_payment_value = CommissionPayment::join('user_licenses', 'commission_payments.user_license_id', '=', 'user_licenses.id')
        ->where('commission_payments.state', 'outstanding')
        ->where('user_licenses.user_id', $this->id)->sum('commission_payments.value');

        //Si ya hay un valor por comisiones generadas anteriormente, se suman los valores
        //de las licencias activas actualmente
        if($commission_pending_payment_value || $full){
            $active_licenses = $this->userLicenses()->where('user_licenses.state', 'Active')->get();

            foreach ($active_licenses as $license) {
                $commission_pending_payment_value += $license->getCommissionData()['commission'];
            }
        }

        return floatval(number_format($commission_pending_payment_value, 2, '.', ''));
    }

    /**
     * Asigna un código de verificación aleatorio y su fecha de expiración
     */
    public function setVerificationCode($save = true)
    {
        $code = rand(0,9);
        $code .= rand(0,9);
        $code .= rand(0,9);
        $code .= rand(0,9);
        $code .= rand(0,9);
        $code .= rand(0,9);

        $expiration = date('Y-m-d H:i:s', strtotime('+'.config('app.verification_code_expiration').'minutes'));

        $this->verification_code = $code;
        $this->verification_code_expiration = $expiration;

        if($save)
            $this->save();
    }

    /**
     * Envia un correo con el código de verificación generado
     */
    public function sendMailVerificationCode($type = 'email')
    {
        switch ($type) {
            //Se está haciendo verificación de email
            case 'email':
                Mail::to($this)->send(new RegisterVerificationCode($this));   
                break;
            
            default:
                break;
        }
    }

    /**
     * Consulta y retorna las configuraciones establecidas para
     * un producto por el usuario actual
     * @param  [type] $product_id [Identificador del producto]
     */
    public function getProductSetting($product_id)
    {
        return $this->productSettings()
        ->where('product_id', $product_id)->first();
    }

    /**
     * Asigna las licencias que no tienen costo a un usuario
     * @return [type] [description]
     */
    public function assignFreeLicenses()
    {
        //Se selecciona cualquier licencia activa del producto
        $licenses = License::select('*')
            ->where('licenses.state', 'Active')
            ->where('licenses.duration', -1)
            ->get();

        foreach ($licenses as $license) {
            //De acuerdo al producto se restablece el max_amount en la configiración del producto
            if($license->product->name == 'TrSoft/Copy Binary'){
                $product_setting = $this->getProductSetting($license->product_id);

                if(!$product_setting){
                    $product_setting = new ProductSetting();
                    $product_setting->amount = 1;//$license->max_amount;
                    $product_setting->user_id = $this->id;
                    $product_setting->product_id = $license->product_id;
                }

                $product_setting->max_amount = $license->max_amount;
                $product_setting->save();
            }

            $this->save();

            //Ultimos datos de comisión registrados
            $commission = $license->lastCommission();
            //Ultimos datos de precios registrados
            $price = $license->lastPrice();

            if($commission && $price && $price->price == 0){
                $user_license = new UserLicense();
                $user_license->user_id = $this->id;
                $user_license->commission_id = $commission->id;
                $user_license->license_price_id = $price->id;
                $user_license->state = 'Active';
                $user_license->activation_date = date('Y-m-d H:i:s');
                $user_license->save();
            }
        }
    }

    public function changePaswword($current_password = '', $new_password = '')
    {
        if(Hash::check($current_password, $this->password)){
            $this->password = Hash::make($new_password);
            $this->save();

            return response(['success' => true], 200);
        }

        return response(['errors' => [[__('messages.invalid_data')]]], 422);
    }

    /**
     * Acceso a IqOption para obtener ssid
     * @param  array  $data [Datos de ingreso del usuario a iqoption]
     */
    public function loginIq($data = [])
    {
        $client = new GuzzleHttpClient(['cookies' => true]);

        //Se hace el login con los datos del cliente
        try {            
            $res = $client->request('POST', 'https://auth.iqoption.com/api/v2/login', [
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ],
                'form_params' => [
                    'identifier'=> $data['user'], 
                    'password'=> $data['password'],
                ]
            ]);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $data = json_decode($e->getResponse()->getBody()->getContents(), true);
            return response(['errors' => [[__($data['message'])]]], 422);
        }


        if($res->getStatusCode() == 200){
            //Se obtienen los datos retornados en el login 
            $data = json_decode($res->getBody()->getContents(), true);

            //Se solicitan los datos del usuario
            try {            
                //$res_data = $client->request('GET', 'https://iqoption.com/api/appinit');
                $res_data = $client->request('GET', 'https://iqoption.com/api/register/getregdata');
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                $data_user = json_decode($e->getResponse()->getBody()->getContents(), true);
                return response(['errors' => [[__($data['message'])]]], 422);
            }

            //Se tuvo acceso a los datos
            if($res_data->getStatusCode() == 200){
                $data_user = json_decode($res_data->getBody()->getContents(), true);

                if($data_user['isSuccessful']){
                    //Usuario que tiene el mismo ID
                    $user_with_id = User::where('broker_id', $data_user['result']['profile']['user_id'])->where('id', '<>', $this->id)->first();
                    //Hay un usuario con el mismo ID
                    if($user_with_id){
                        return response(['errors' => [[__('messages.broker_id_exists')]]], 422);     
                    }

                    if($data_user['result']['profile']['currency'] != 'USD'){
                        return response(['errors' => [[__('messages.invalid_currency')]]], 422);                             
                    }

                    if(array_key_exists('ssid', $data)){
                        $this->broker_id = $data_user['result']['profile']['user_id'];
                        $this->ssid = $data['ssid'];
                        $this->save();
                        return response(['success' => true], 200);
                    }else{
                        return response(['errors' => [[__('messages.account_verification_not_supported')]]], 422);   
                    }
                }
            }
        }

        return response(['errors' => [[__('messages.invalid_data')]]], 422);
    }

    public function getDataLastOperation()
    {
        $operation = $this->optionsTrader()->orderBy('id', 'DESC')->first();

        $win = $operation?Option::where('parent_option_id', $operation->id)->where('result', 1)->count():0;
        $lose = $operation?Option::where('parent_option_id', $operation->id)->where('result', -1)->count():0;
        $equal = $operation?Option::where('parent_option_id', $operation->id)->where('result', 0)->count():0;

        return [
            "expiration_time" => $operation->expiration_time,
            "image" => $operation->active_image,
            "direction" => $operation->direction,
            "win" => $win,
            "lose" => $lose,
            "equal" => $equal
        ];
    }

    /**
     * Asigna los datos de rendimiento del trader en la cuenta de un cliente
     */
    public function setDataTraderPerformance(Option $operation)
    {
        //Sólo se aplica para operaciones que han expirado y están en cuenta real
        if($operation->is_demo == -1 && $operation->result != null){
            //Se busca el rendimiento del trader con el cliente
            //el cual no haya generado comisión todavia 
            $trader_performance = $this->tradersPerformance()
            ->where('user_license_id', $operation->user_license_id)
            ->whereNull('commission_payment_id')->first();

            if(!$trader_performance){
                $trader_performance = new TraderPerformance();
                $trader_performance->performance = 0;
                $trader_performance->user_id = $this->id;
                $trader_performance->user_license_id = $operation->user_license_id;
            }

            $trader_performance->performance += $operation->profit_value;
            $trader_performance->save();
        }
    }
}
