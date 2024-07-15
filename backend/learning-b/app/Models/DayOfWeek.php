<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DayOfWeek extends Model
{

    use HasFactory;
    
    protected $table = 'day_of_week';
    protected $primaryKey = 'day_of_week_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'day_of_week_id',
        'name',
    ];

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'day_of_week_id', 'day_of_week_id');
    }
}