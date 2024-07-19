<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->uuid('schedule_id')->primary();
            $table->uuid('user_id');
            $table->string('day_of_week_id');
            $table->integer('duration');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('user_id')->references('user_id')->on('learning_user')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};