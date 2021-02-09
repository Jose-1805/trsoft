<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LicensePrice extends Model
{
    protected $table = 'license_prices';

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
