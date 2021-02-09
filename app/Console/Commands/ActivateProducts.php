<?php

namespace App\Console\Commands;

use App\Models\ProductSetting;
use App\User;
use Illuminate\Console\Command;

class ActivateProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:activate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Evalua los productos con fecha de activación';

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
        //Se asigna null a las configuraciones con fecha de vencimiento menor a la fecha actual
        ProductSetting::where('product_settings.activation_date','<=', date('Y-m-d H:i:s'))->update(['activation_date' => null, 'operations' => 0, 'current_balance' => 0, 'higher_balance' => 0]);
    }
}
