<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Option;
use App\TableJL1805;
use Illuminate\Http\Request;

class PerformanceController extends Controller
{
    public function __construct()
    {
    	
    }

    public function list(Request $request)
    {
		$query = Option::select('options.*')
        ->join('users_start_trading', 'options.user_start_trading_id', '=', 'users_start_trading.id')
        ->join('users', 'users_start_trading.user_id', '=', 'users.id')
        ->where('users.id', $request->user()->id)
        ->whereNotNull('options.result');

        if($request->demo){
        	$query = $query->where('options.is_demo', 1);
        }else{
        	$query = $query->where('options.is_demo', -1);
        }

        if($request->start_date)
        	$query = $query->where('options.expiration_time', '>=', $request->start_date);

        if($request->end_date)
        	$query = $query->where('options.expiration_time', '<=', $request->end_date);

    	$table = new TableJL1805($query, $request->config);

    	$response = $table->make()->toArray();
    	$response['more'] = [
    		'performance'=>$query->sum('profit_value'),
    		'success'=>(clone $query)->where('result', 1)->count(),
            'equal'=>(clone $query)->where('result', 0)->count()
    	];
    	return $response;
    }
}
