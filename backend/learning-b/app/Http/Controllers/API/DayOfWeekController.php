<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DayOfWeek;
use Illuminate\Http\Request;


class DayOfWeekController extends Controller
{
    public function index()
    {
        return DayOfWeek::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $dayOfWeek = DayOfWeek::create($request->all());
        return response()->json($dayOfWeek, 201);
    }

    public function show(string $id)
    {
        return DayOfWeek::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $dayOfWeek = DayOfWeek::findOrFail($id);
        $dayOfWeek->update($request->all());
        return response()->json($dayOfWeek, 200);
    }

    
    public function destroy(string $id)
    {
        DayOfWeek::destroy($id);
        return response()->json(null, 204);
    }
}
