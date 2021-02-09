<?php

namespace App\Http\Middleware;

use Closure;
use GuzzleHttp\Client;

class GoogleRecaptcha
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {   
        //Para las extensiones no se valida el recaptcha
        if(
            //$request->server('HTTP_ORIGIN') == 'chrome-extension://'.env('EXTENSION_COPY_BINARY_CLIENT')
            $request->server('HTTP_ORIGIN') == 'chrome-extension://'.env('EXTENSION_COPY_BINARY_TRADER')
            || count(explode('chrome-extension://', $request->server('HTTP_ORIGIN'))) == 2
            || !$request->server('HTTP_ORIGIN')
        ){
            return $next($request);
        }

        if($request->has('token_recaptcha')){
            $client = new Client();

            $res = $client->request('POST', env('GOOGLE_URL_RECAPTCHA_VALID'), [
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ],
                'form_params' => [
                    'secret' => env('GOOGLE_API_SECRET'),
                    'response' => $request->token_recaptcha
                ]
            ]);

            if($res->getStatusCode() == 200){
                $data = json_decode($res->getBody()->getContents(), true);
                if(in_array('score', $data)){

                    if($data['score'] >= config('app.min_score_recaptcha'))
                        return $next($request);
                }
            }
        }

        return response('Unauthorized. RC', 401);
    }
}
