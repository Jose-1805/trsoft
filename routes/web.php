<?php

use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/scheduler', function(){
	Artisan::call('schedule:run');
});

$cant_paramns = 8;
$path = '';

for ($i=0; $i < $cant_paramns; $i++) { 
	$path .= '/{path'.$i.'?}';
}

Route::view($path, 'app');