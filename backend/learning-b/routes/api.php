<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ScheduleController;
use App\Http\Controllers\API\LearningUserController;
use App\Http\Controllers\API\RecordController;
use App\Http\Controllers\API\DayOfWeekController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('schedules', ScheduleController::class);
Route::apiResource('learning_users', LearningUserController::class);
Route::apiResource('records', RecordController::class);
Route::apiResource('day_of_weeks', DayOfWeekController::class);