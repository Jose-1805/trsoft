<?php

namespace App\Http\Middleware;

use Closure;

class UserIs
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $name)
    {
        $user = $request->user();
        if($user){
            if($user['is_'.$name] == 1){
                return $next($request);
            }
        }
        
        return response('Unauthorized. UI',401);

    }
}
