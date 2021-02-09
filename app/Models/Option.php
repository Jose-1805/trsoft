<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $table = 'options';

    public $timestamps = false;

    public function userLicense()
    {
    	return $this->belongsTo(UserLicense::class);
    }

    public static function payCommissions($user_id)
    {
    	Option::join('user_licenses', 'options.user_license_id', '=', 'user_licenses.id')
    	->where('user_licenses.user_id', $user_id)
    	->where('options.commission_paid', -1)->update(['commission_paid' => 1]);

    }

    public function updateResult($result)
    {
        $user = $this->userLicense->user;

        $product_setting = $user->getProductSetting(env('BINARY_COPY_ID'));

        $this->result = $result;

        if($this->result == 1){
            $this->profit_value = ($this->amount * $this->profit_percentage)/100;
            //El saldo incrementa con las ganancias
            $product_setting->current_balance += $this->profit_value;

            //SI operations es mayor a 0 es porque no ha habido cambio de día durante el transcurso de la operación
            //abrió y cerro durante el mismo día, por lo cual el valor de la inversión se adiciona al saldo actual
            //ya que se resta cuando la operación abre
            if($product_setting->operations > 0){
                $product_setting->current_balance += $this->amount;
            }

            //Si el saldo actual es mayor al saldo más alto registrado
            //se actualiza
            if($product_setting->current_balance > $product_setting->higher_balance)
                $product_setting->higher_balance = $product_setting->current_balance;
        }else if($this->result == 0){
            //SI operations es mayor a 0 es porque no ha habido cambio de día durante el transcurso de la operación
            //abrió y cerro durante el mismo día, por lo cual el valor de la inversión se adiciona al saldo actual
            //ya que se resta cuando la operación abre
            if($product_setting->operations > 0){
                $product_setting->current_balance += $this->amount;
            }

            $this->profit_value = 0;
        }else if($this->result == -1){
            $this->profit_value = $this->amount * -1;

            //SI operations es igual a 0 es porque ha habido cambio de día durante el transcurso de la operación
            //abrió en un dñia y cerro en otro, por lo cual el valor de la inversión se resta al saldo actual
            //ya que la pérdida se registro en el día anterior pero los datos ya no están y la perdida es del día actual
            if($product_setting->operations == 0){
                $product_setting->current_balance -= $this->amount;
            }
        }

        //$this->is_demo = -1;
        $this->is_demo = $product_setting->use_practice_account;
        $this->save();

        //Se asignan los datos de rendimiento del trader con el cliente
        $user->setDataTraderPerformance($this);

        $product_setting->save();

        $stop_loss_reached = false;
        //Si la operación fue fallida se evalua el stop loss si está habilitado
        if($this->result == -1 && $product_setting->stop_loss == 1){
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
        if($this->is_demo == -1 && $this->result == 1) {
            $this->userLicense->evaluateForCommission();
        }
    }
}
