<?php

namespace App\Console\Commands;

use App\Models\License;
use Illuminate\Console\Command;

class EvaluateLicenses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'licenses:evaluate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Evalua estados de las licencias según la fecha actual';

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
        License::evaluateLicenses();
    }
}
