<?php

namespace App\Http\Middleware;

use Closure;

class ValidateDomain
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
        //Para las extensiones no se valida el dominio
        if($request->server('HTTP_ORIGIN') == 'chrome-extension://'.env('EXTENSION_COPY_BINARY_TRADER')
           || count(explode('chrome-extension://', $request->server('HTTP_ORIGIN'))) == 2
        ){
            return $next($request);
        }
    
        //dd($request);
        //dd($request->header('user-agent'));
        //No es una petición de google app engine
        if(!is_numeric(strpos(strtolower($request->header('user-agent')), 'appengine-google'))){
            if($request->server('HTTP_HOST') == 'trsoft-company.uc.r.appspot.com'){
                return redirect('https://www.trsoft-company.com'.$request->server('REQUEST_URI'));
            }
        }
        
        return $next($request);
    }
}
