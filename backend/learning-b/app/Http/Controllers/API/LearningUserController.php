<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LearningUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


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

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
        ]);

        $user = LearningUser::where('email', $request->email)->first();

        if ($user && $user->name === $request->name) {
            // ログイン成功
            return response()->json([
                'message' => 'Login successful',
                'user_id' => $user->user_id // ユーザーIDを追加
            ], 200);
        } else {
            // ログイン失敗
            return response()->json(['error' => 'Unauthorised'], 401);
        }
    }
}