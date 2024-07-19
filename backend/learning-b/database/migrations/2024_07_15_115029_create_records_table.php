<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('records', function (Blueprint $table) {
            $table->uuid('record_id')->primary();
            $table->uuid('user_id');
            $table->date('date');
            $table->integer('duration');
            $table->text('note')->nullable();
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
        Schema::dropIfExists('records');
    }
};