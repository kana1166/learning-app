<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;


class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::with('user', 'dayOfWeek')->get();
    return inertia()->render('Schedules/Index', [
        'schedules' => $schedules,
    ]);
    }

    public function create()
    {
        return inertia()-> render('Schedules/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|uuid|exists:learning_users,user_id',
            'day_of_week_id' => 'required|uuid|exists:day_of_week,day_of_week_id',
            'duration' => 'required|integer',
        ]);
        Schedule::create($request->all());
        return redirect()->route('schedules.index')->with('success', 'Schedule created successfully.');
    }

    public function show(string $id)
    {
        $schedule = Schedule::findOrFail($id);
        return inertia()->render('Schedules/Show', [
            'schedule' => $schedule,
        ]);
    }

    public function edit(string $id)
    {
        $schedule = Schedule::findOrFail($id);
        return inertia()->render('Schedules/Edit', [
            'schedule' => $schedule,
        ]);

    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'user_id' => 'required|uuid|exists:learning_users,user_id',
            'day_of_week_id' => 'required|uuid|exists:day_of_week,day_of_week_id',
            'duration' => 'required|integer',
        ]);

        $schedule = Schedule::findOrFail($id);
        $schedule->update($request->all());
        return redirect()->route('schedules.index')->with('success', 'Schedule updated successfully.');
    
    }

    public function destroy(string $id)
    {
        Schedule::destroy($id);
        return redirect()->route('schedules.index')->with('success', 'Schedule deleted successfully.');
    }
}
