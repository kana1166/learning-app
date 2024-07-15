<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LearningUser;
use Illuminate\Http\Request;


class LearningUserController extends Controller
{
    public function index()
    {
        return LearningUser::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string|unique:learning_user,user_id',
            'firebase_id' => 'required|string',
            'email' => 'required|email|unique:learning_user,email',
            'name' => 'required|string',
            'status' => 'required|string',
        ]);

        $learningUser = LearningUser::create([
            'user_id' => $request->user_id,
            'firebase_id' => $request->firebase_id,
            'email' => $request->email,
            'name' => $request->name,
            'status' => $request->status,
        ]);

        return response()->json($learningUser, 201);
    }

    public function show(string $id)
    {
        return LearningUser::findOrFail($id);
    }


    public function update(Request $request, string $id)
    {
        $request->validate([
            'firebase_id' => 'required|string',
            'email' => 'required|email|unique:learning_user,email,' . $id . ',user_id',
            'name' => 'required|string',
            'status' => 'required|string',
        ]);

        $learningUser = LearningUser::findOrFail($id);
        $learningUser->update([
            'firebase_id' => $request->firebase_id,
            'email' => $request->email,
            'name' => $request->name,
            'status' => $request->status,
        ]);

        return response()->json($learningUser, 200);
    }

    public function destroy(string $id)
    {
        LearningUser::destroy($id);
        return response()->json(null, 204);
    }
}
