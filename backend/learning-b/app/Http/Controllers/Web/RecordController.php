<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Record;

class RecordController extends Controller
{
    public function index()
    {
        $Records = Record::all();
        return inertia()->render('Records/Index', [
            'Records' => $Records,
        ]);
    }

    public function create()
    {
        return inertia()->render('Records/Create');
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
        Record::create($request->all());
        return redirect()->route('records.index')->with('success', 'Record created successfully.');
    }

    public function show(string $id)
    {
        $record = Record::findOrFail($id);
        return inertia()->render('Records/Show', [
            'record' => $record,
        ]);
    }

    public function edit(string $id)
    {
        $record = Record::findOrFail($id);
        return inertia()->render('Records/Edit', [
            'record' => $record,
        ]);
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
        return redirect()->route('records.index');
    }


    public function destroy(string $id)
    {
        Record::destroy($id);
        return redirect()->route('records.index');
    }
}
