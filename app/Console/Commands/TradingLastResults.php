<?php

namespace App\Console\Commands;

use DateTime;
use DateTimeZone;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TradingLastResults extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trading-last-results {amount} {type} {--only-demo} {--only-real}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Consulta los últimos resultados de trading según los parametros enviados.';

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
        $amount = $this->argument('amount') -1;
        $type = $this->argument('type');

        $current = new \DateTime();
        $current->setTimezone(new DateTimeZone('America/Bogota'));

        $start = new DateTime($current->format('Y-m-d').' 00:00:00');
        $end = new DateTime($current->format('Y-m-d').' 23:59:59');

        //Se agrega un dia a las fechas de busqueda ya que al comparar con los
        //time almacenados en DB resulta un dia de diferencia
        $start->modify('+1 day');
        $end->modify('+1 day');

        //Para el calculo con meses o años si es 0 se asigna 1 para que consulte el ultimo mes o año
        if($amount == 0 && (strtolower($type) == 'months' || strtolower($type) == 'years')){
            $amount = 1;
        }

        $start->modify('-'.$amount.' '.$type);

        $start_ = $start->getTimestamp();
        $end_ = $end->getTimestamp();

        $query_general_conditions_basic = "AND options.expiration_time BETWEEN $start_ AND $end_";
        $query_general_conditions = $query_general_conditions_basic;

        if($this->option('only-real')){
            $query_general_conditions .= " AND options.is_demo = -1";
        }else{
            if($this->option('only-demo')){
                $query_general_conditions .= " AND options.is_demo = 1";
            }   
        }

        $query = "select sum(options.amount) as total_inversion, sum(options.profit_value) as global_performance, clients.total as total_clients, count(options.id) as number_operations_clients, traders.number_operations_traders, successful_operations.successful_operations, failed_operations.failed_operations, neutral_operations.neutral_operations from options , ( select count(*) as number_operations_traders from options where options.user_id IS NOT NULL $query_general_conditions_basic AND options.is_demo IS NULL) traders, ( select count(*) as successful_operations from options where options.result = 1 $query_general_conditions ) successful_operations, ( select count(*) as failed_operations from options where options.result = -1 $query_general_conditions ) failed_operations, ( select count(*) as neutral_operations from options where options.result = 0 $query_general_conditions ) neutral_operations, ( select count(*) as total from ( SELECT users_start_trading.user_id from options join users_start_trading on users_start_trading.id = options.user_start_trading_id where user_start_trading_id is not null $query_general_conditions GROUP BY users_start_trading.user_id ) q ) clients where options.user_start_trading_id IS NOT NULL $query_general_conditions";


        $start->modify('-1 day');
        $end->modify('-1 day');

        $this->info($current->format('Y-m-d H:i:s'));
        $this->info('Start: '.$start->format('Y-m-d H:i:s'));
        $this->info('End: '.$end->format('Y-m-d H:i:s'));
        
        dd(DB::select($query));
    }
}