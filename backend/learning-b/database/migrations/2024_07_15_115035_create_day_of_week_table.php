<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('day_of_week', function (Blueprint $table) {
            $table->unsignedInteger('day_of_week_id')->primary();
            $table->string('name');
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('day_of_week');
    }
};
