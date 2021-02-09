<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    protected $table = 'commissions';

    public $timestamps = false;

    public function userLicenses()
    {
    	return $this->hasMany(UserLicense::class);
    }

    public function license()
    {
    	return $this->belongsTo(License::class);
    }
}
