<?php

namespace App\Console\Commands;

use App\Models\ProductSetting;
use App\User;
use Illuminate\Console\Command;

class RestartBalances extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'balances:restart';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restablece los balances actuales y máximos de todos los clientes';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {   
        //Se restablcen los datos de saldos de cada usuario
        //
        ProductSetting::where('id','>', 0)->update(['activation_date' => null, 'operations' => 0, 'current_balance' => 0, 'higher_balance' => 0]);
    }
}
