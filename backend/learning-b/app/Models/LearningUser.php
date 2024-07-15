<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class LearningUser extends Model
{
    use SoftDeletes;

    protected $table = 'learning_user';
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'firebase_id',
        'email',
        'name',
        'status',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'user_id', 'user_id');
    }

    public function records()
    {
        return $this->hasMany(Record::class, 'user_id', 'user_id');
    }
}