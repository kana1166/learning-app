<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Record;
use App\Models\LearningUser;
use Illuminate\Support\Facades\Log;



use Inertia\Inertia;

class RecordController extends Controller
{
    public function index()
    {
        $records = Record::all();
        $users = LearningUser::all();
        return Inertia::render('Records/Index', [
            'records' => $records,
            'users' => $users,
        ]);
    }


    public function create()
    {
        return Inertia::render('Records/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:learning_user,user_id',
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
        return Inertia::render('Records/Edit', [
            'record' => $record,
        ]);
    }


    public function update(Request $request, string $id)
    {
        try {
        
        $validatedData = $request->validate([
            'learning_user_id' => 'required|exists:learning_user,user_id',
            'date' => 'required|date',
            'duration' => 'required|integer',
            'note' => 'nullable|string',
        ]);
        $validatedData['user_id'] = $validatedData['learning_user_id'];
        unset($validatedData['learning_user_id']);

        // バリデーションに成功したデータをログに出力
        Log::info('Validated data:', $validatedData);

        $record = Record::findOrFail($id);
        $record->update($validatedData);
        return redirect()->route('records.index');
    } catch (\Exception $e) {
        Log::error('Error updating record: ' . $e->getMessage(), [
            'exception' => $e,
            'request' => $request->all(),
            'validatedData' => $validatedData ?? null,
        ]);
    
        return redirect()->route('records.index')->with('error', 'An unexpected error occurred.');
    }
}



    public function destroy(string $id)
    {
        Record::destroy($id);
        return redirect()->route('records.index');
    }
}