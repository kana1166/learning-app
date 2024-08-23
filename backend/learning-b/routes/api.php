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

Route::apiResource('schedules', ScheduleController::class)->names([
    'index' => 'api.schedules.index',
    'store' => 'api.schedules.store',
    'show' => 'api.schedules.show',
    'update' => 'api.schedules.update',
    'destroy' => 'api.schedules.destroy',
]);
Route::apiResource('learning_user', LearningUserController::class)->names([
    'index' => 'api.learning_user.index',
    'store' => 'api.learning_user.store',
    'show' => 'api.learning_user.show',
    'update' => 'api.learning_user.update',
    'destroy' => 'api.learning_user.destroy',
]);
Route::apiResource('records', RecordController::class)->names([
    'index' => 'api.records.index',
    'store' => 'api.records.store',
    'show' => 'api.records.show',
    'update' => 'api.records.update',
    'destroy' => 'api.records.destroy',
]);
Route::apiResource('day_of_week', DayOfWeekController::class)->names([
    'index' => 'api.day_of_week.index',
    'store' => 'api.day_of_week.store',
    'show' => 'api.day_of_week.show',
    'update' => 'api.day_of_week.update',
    'destroy' => 'api.day_of_week.destroy',
]);
Route::post('/learning_user/login', [LearningUserController::class, 'login']);
