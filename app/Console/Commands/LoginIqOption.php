<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client as GuzzleHttpClient;

class LoginIqOption extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'login-iq-option {--user=} {--pass=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
        $client = new GuzzleHttpClient(['cookies' => true]);

        //Se hace el login con los datos del cliente
        try {            
            $res = $client->request('POST', 'https://auth.iqoption.com/api/v2/login', [
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ],
                'form_params' => [
                    'identifier'=> $this->option('user'), 
                    'password'=> $this->option('pass'),
                ]
            ]);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $data = json_decode($e->getResponse()->getBody()->getContents(), true);
            $this->info("ERROR 1");
            dd($data);
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
                $this->info("ERROR 2");
                dd($data);
            }

            //Se tuvo acceso a los datos
            if($res_data->getStatusCode() == 200){
                $data_user = json_decode($res_data->getBody()->getContents(), true);

                if($data_user['isSuccessful']){
                    $this->info("SUCCESSFULL");
                    //dd($data_user);
                    if(array_key_exists('ssid', $data)){
                        $this->info($data["ssid"]);
                    }
                }
            }
        }

    }
}
