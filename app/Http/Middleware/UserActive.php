<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Auth;

class UserActive
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
        if(Auth::check() && !Auth::user()->is_active){
            //if($request->ajax()){
                $cookie = \Cookie::forget(env('COOKIE_AUTH_NAME'));
                return response('Unauthorized. UA',401)
                        ->withCookie($cookie);
            /*}else{
                return "Inactive user";
            }*/
        }

        return $next($request);
    }
}
