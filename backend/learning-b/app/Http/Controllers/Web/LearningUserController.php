<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LearningUser;

use Inertia\Inertia;

class LearningUserController extends Controller
{
    public function index()
    {
        $learningUsers = LearningUser::all();
        return Inertia::render('LearningUsers/Index', [
            'users' => $learningUsers,
        ]);
    }

    public function create()
    {
        return Inertia::render('LearningUsers/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
        ]);
        LearningUser::create($request->all());
        return redirect()->route('learning-user.index');
    }

    public function show(string $id)
    {
        $learning_user = LearningUser::findOrFail($id);
        return inertia()->render('LearningUsers/Show', [
            'learning-user' => $learning_user,
        ]);
    }

   
    public function edit(string $id)
    {
        $learning_user = LearningUser::findOrFail($id);
        return Inertia::render('LearningUsers/Edit', [
            'learning-user' => $learning_user,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
        ]);

        $learning_user = LearningUser::findOrFail($id);
        $learning_user->update($request->all());
        return redirect()->route('learning-user.index')->with('success', 'User updated successfully.');
    }

    
    public function destroy($id)
{
    $learning_user = LearningUser::findOrFail($id);

    if ($learning_user) {
        $learning_user->delete();
    }

    return redirect()->route('learning-user.index')->with('success', 'User deleted successfully.');
}

}