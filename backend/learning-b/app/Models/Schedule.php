<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Schedule extends Model
{
    use SoftDeletes;

    protected $table = 'schedules';
    protected $primaryKey = 'schedule_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'schedule_id',
        'user_id',
        'day_of_week_id',
        'duration',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function user()
    {
        return $this->belongsTo(LearningUser::class, 'user_id', 'user_id');
    }
    public function dayOfWeek()
    {
        return $this->belongsTo(DayOfWeek::class, 'day_of_week_id', 'day_of_week_id');
    }
}