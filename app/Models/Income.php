<?php

namespace App\Models;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    protected $table = 'income';
    public $timestamps = false;

    protected $fillable = [
        'type', 'value', 'exchange_rate_cop', 'payment_gateway', 'transfer_id', 'currency_id'
    ];

    protected $iva_percetage = 19;
    protected $trsoft_utility = 20;
    protected $partners_utility = 20;

    /**
     * Genera los egresos relacionados al ingreso
     */
    public function generateExpenses()
    {
    	//Iva
    	$iva_expense = new Expense();
    	$iva_expense->type = 'iva';
    	$iva_expense->value = ($this->value * $this->iva_percetage)/100;
    	$iva_expense->exchange_rate_cop = $this->exchange_rate_cop;
    	$iva_expense->income_id = $this->id;
    	$iva_expense->currency_id = $this->currency_id;
    	$iva_expense->save();

    	//Trsoft utility, se calcula con el valor después de descontar el iva
		$trsoft_utility_expense = new Expense();
		$trsoft_utility_expense->type = 'trsoft utility';
		//En la compra de una licencia la utilidad de trsoft aumenta
		if($this->type == 'license'){
			$trsoft_utility_expense->value = (
				//Valor despues de restarle el iva
				($this->value - $iva_expense->value) 
				//Se calcula el % de utilidad de TrSoft, se separa la utilidad de socios
				* (100 - $this->partners_utility)
			)/100;
		}else if($this->type == 'commission'){
			//Cuando se paga una comisión la utiliad de TrSoft es la establecida
			$trsoft_utility_expense->value = (($this->value - $iva_expense->value) * $this->trsoft_utility)/100;
		}

		$trsoft_utility_expense->exchange_rate_cop = $this->exchange_rate_cop;
		$trsoft_utility_expense->state = 'paid out';
		$trsoft_utility_expense->income_id = $this->id;
		$trsoft_utility_expense->currency_id = $this->currency_id;
		$trsoft_utility_expense->save(); 

    	//Partners utility, se calcula con el valor después de descontar el iva
		$partners_utility_expense = new Expense();
		$partners_utility_expense->type = 'partners utility';
		$partners_utility_expense->value = (($this->value - $iva_expense->value) * $this->partners_utility)/100;
		$partners_utility_expense->exchange_rate_cop = $this->exchange_rate_cop;
		$partners_utility_expense->income_id = $this->id;
		$partners_utility_expense->currency_id = $this->currency_id;
		$partners_utility_expense->save();    	

		//Si es el pago de una comisión se deben generar los egresos
		//para pago de comisión de traders y desarrollador
		if($this->type == 'commission'){

		}
    }
}
