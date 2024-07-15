<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LearningUser;

class LearningUserController extends Controller
{
    public function index()
    {
        $LearningUsers = LearningUser::all();
        return inertia()->render('LearningUsers/Index', [
            'LearningUsers' => $LearningUsers,
        ]);
    }

    public function create()
    {
        return inertia()->render('LearningUsers/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
        LearningUser::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
        return redirect()->route('learning_users.index');
    }

    public function show(string $id)
    {
        $learning_user = LearningUser::findOrFail($id);
        return inertia()->render('LearningUsers/Show', [
            'learning_user' => $learning_user,
        ]);
    }

   
    public function edit(string $id)
    {
        $learning_user = LearningUser::findOrFail($id);
        return inertia()->render('LearningUsers/Edit', [
            'learning_user' => $learning_user,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $learning_user = LearningUser::findOrFail($id);
        $learning_user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
        return redirect()->route('learning_users.index');
    }

    
    public function destroy(string $id)
    {
        LearningUser::destroy($id);
        return redirect()->route('learning_users.index');
    }
}
