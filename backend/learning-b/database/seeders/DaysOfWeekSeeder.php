<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DayOfWeek;

class DaysOfWeekSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $days = [
            ['day_of_week_id' => 1, 'name' => 'Monday'],
            ['day_of_week_id' => 2, 'name' => 'Tuesday'],
            ['day_of_week_id' => 3, 'name' => 'Wednesday'],
            ['day_of_week_id' => 4, 'name' => 'Thursday'],
            ['day_of_week_id' => 5, 'name' => 'Friday'],
            ['day_of_week_id' => 6, 'name' => 'Saturday'],
            ['day_of_week_id' => 7, 'name' => 'Sunday'],
        ];

        foreach ($days as $day) {
            DayOfWeek::create($day);
        }
    }
}
