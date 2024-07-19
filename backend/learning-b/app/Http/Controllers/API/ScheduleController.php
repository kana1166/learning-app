<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::all();
        return response()->json(['schedules' => $schedules]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:learning_user,user_id',
            'day_of_week_id' => 'required|exists:day_of_week,day_of_week_id',
            'duration' => 'required|integer',

        ]);

        $schedule = Schedule::create([
            'user_id' => $request->user_id,
            'day_of_week_id' => $request->day_of_week_id,
            'duration' => $request->duration,
        ]);

        return response()->json($schedule, 201);
    }


    public function show(string $id)
    {
        return Schedule::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'user_id' => 'required|uuid|exists:learning_user,user_id',
            'day_of_week_id' => 'required|uuid|exists:day_of_week,day_of_week_id',
            'duration' => 'required|integer',
        ]);

        $schedule = Schedule::findOrFail($id);
        $schedule->update([
            'user_id' => $request->user_id,
            'day_of_week_id' => $request->day_of_week_id,
            'duration' => $request->duration,
        ]);
        return response()->json($schedule, 200);
    }

    public function destroy(string $id)
    {
        Schedule::destroy($id);
        return response()->json(null, 204);
    }
}