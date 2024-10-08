<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DayOfWeek;

use Inertia\Inertia;

class DayOfWeekController extends Controller
{
    public function index()
    {
        $dayOfWeeks = DayOfWeek::all();
        return Inertia::render('DayOfWeeks/Index', [
            'dayOfWeeks' => $dayOfWeeks,
        ]);
    }

    public function create()
    {
        return inertia::render('DayOfWeeks/Create');
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);
        DayOfWeek::create($request->all());
        return redirect()->route('day_of_weeks.index');
    }

    
    public function show(string $id)
    {
        $dayOfWeek = DayOfWeek::findOrFail($id);
        return inertia()->render('DayOfWeeks/Show', [
            'dayOfWeek' => $dayOfWeek,
        ]);
    }


    public function edit(string $id)
    {
        $dayOfWeek = DayOfWeek::findOrFail($id);
        return Inertia::render('DayOfWeeks/Edit', [
            'dayOfWeek' => $dayOfWeek,
        ]);
    }

    
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $dayOfWeek = DayOfWeek::findOrFail($id);
        $dayOfWeek->update($request->all());
        return redirect()->route('day_of_weeks.index');
    }


    public function destroy(string $id)
    {
        DayOfWeek::destroy($id);
        return redirect()->route('day_of_weeks.index');
    }
}