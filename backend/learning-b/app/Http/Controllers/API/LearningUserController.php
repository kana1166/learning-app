<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LearningUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class LearningUserController extends Controller
{
    public function index()
    {
        return LearningUser::all();
    }

    public function store(Request $request)
    {
        Log::info('Request Data: ', $request->all());
        $request->validate([
            'email' => 'required|email|unique:learning_user,email',
            'name' => 'required|string',
        ]);

        Log::info('Validation passed');

        $learningUser = LearningUser::create([
            'email' => $request->email,
            'name' => $request->name,
        ]);

        Log::info('LearningUser created: ', $learningUser->toArray());

        return response()->json($learningUser, 201);
    }

    public function show(string $id)
    {
        return LearningUser::findOrFail($id);
    }


    public function update(Request $request, string $id)
    {
        $request->validate([
            'email' => 'required|email|unique:learning_user,email,' . $id . ',user_id',
            'name' => 'required|string',
        ]);

        $learningUser = LearningUser::findOrFail($id);
        $learningUser->update([
            'email' => $request->email,
            'name' => $request->name,
        ]);

        return response()->json($learningUser, 200);
    }

    public function destroy(string $id)
    {
        LearningUser::destroy($id);
        return response()->json(null, 204);
    }
}