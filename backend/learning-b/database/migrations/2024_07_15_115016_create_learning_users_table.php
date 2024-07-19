<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('learning_user', function (Blueprint $table) {
            $table->uuid('user_id')->primary();
            $table->string('email')->unique();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
            
        });
    }

    public function down()
    {
        Schema::dropIfExists('learning_user');
    }
};