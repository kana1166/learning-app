<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Http\Request;


class RecordController extends Controller
{
    public function index()
    {
        return Record::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'record_id' => 'required|uuid',
            'user_id' => 'required|exists:users,user_id',
            'date' => 'required|date',
            'duration' => 'required|integer',
            'note' => 'nullable|string',
        ]);

        $record = Record::create($request->all());
        return response()->json($record, 201);
    }

    public function show(string $id)
    {
        return Record::findOrFail($id);
    }


    public function update(Request $request, string $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'date' => 'required|date',
            'duration' => 'required|integer',
            'note' => 'nullable|string',
        ]);

        $record = Record::findOrFail($id);
        $record->update($request->all());
        return response()->json($record, 200);
    }


    public function destroy(string $id)
    {
        Record::destroy($id);
        return response()->json(null, 204);
    }
}
