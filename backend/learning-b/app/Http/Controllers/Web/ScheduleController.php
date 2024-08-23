<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use App\Models\LearningUser;

use Illuminate\Support\Facades\Log;

use Inertia\Inertia;


class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::with('user', 'dayOfWeek')->get();
        $users = LearningUser::all();
        return Inertia::render('Schedules/Index', [
        'schedules' => $schedules,
        'users' => $users,
    ]);
    }

    public function create()
    {
        return Inertia::render('Schedules/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|uuid|exists:learning_user,user_id',
            'day_of_week_id' => 'required|uuid|exists:day_of_week,day_of_week_id',
            'duration' => 'required|integer',
        ]);
        Schedule::create($request->all());
        return redirect()->route('schedules.index')->with('success', 'Schedule created successfully.');
    }

    public function show(string $id)
    {
        $schedule = Schedule::findOrFail($id);
        return inertia::render('Schedules/Show', [
            'schedule' => $schedule,
        ]);
    }

    public function edit(string $id)
    {
        $schedule = Schedule::findOrFail($id);
        return Inertia::render('Schedules/Edit', [
            'schedule' => $schedule,
        ]);

    }

    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'learning_user_id' => 'required|exists:learning_user,user_id',
            'day_of_week_id' => 'required|uuid|exists:day_of_week,day_of_week_id',
            'duration' => 'required|integer',
        ]);
        $validatedData['user_id'] = $validatedData['learning_user_id'];
        unset($validatedData['learning_user_id']);

        // バリデーションに成功したデータをログに出力
        Log::info('Validated data:', $validatedData);
        
        $schedule = Schedule::findOrFail($id);
        $schedule->update($validatedData);

        return redirect()->route('schedules.index')->with('success', 'Schedule updated successfully.');
    
    }

    public function destroy(string $id)
    {
        Schedule::destroy($id);
        return redirect()->route('schedules.index')->with('success', 'Schedule deleted successfully.');
    }
}