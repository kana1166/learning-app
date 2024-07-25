/** @format */
"use client";

import { useUser } from "../../context/UserContext";
import { useEffect, useState, useRef } from "react";
import CreateSchedulePage from "../_components/schedule/page";

interface Schedule {
  schedule_id: string;
  day_of_week_id: string;
  duration: number;
  user_id: string;
}

interface DayOfWeek {
  day_of_week_id: number;
  name: string;
}

const ScheduleList = () => {
  const { userId } = useUser();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedData = useRef(false);

  // 曜日データをハードコード
  const daysOfWeek: DayOfWeek[] = [
    { day_of_week_id: 1, name: "月曜日" },
    { day_of_week_id: 2, name: "火曜日" },
    { day_of_week_id: 3, name: "水曜日" },
    { day_of_week_id: 4, name: "木曜日" },
    { day_of_week_id: 5, name: "金曜日" },
    { day_of_week_id: 6, name: "土曜日" },
    { day_of_week_id: 7, name: "日曜日" },
  ];

  useEffect(() => {
    if (hasFetchedData.current) return; // 既にフェッチされている場合は何もしない
    hasFetchedData.current = true; // フェッチを実行したことを記録

    if (!userId) {
      setError("ユーザーIDが見つかりませんでした");
      setIsLoading(false);
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schedules`;
    console.log("Fetching user data from:", apiUrl);

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          console.error("Response not OK:", res.status, res.statusText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);

        if (data.schedules && Array.isArray(data.schedules)) {
          // 特定のユーザーIDに基づいてスケジュールをフィルタリング
          const userSchedules = data.schedules.filter(
            (schedule: Schedule) => schedule.user_id === userId
          );
          if (userSchedules.length === 0) {
            throw new Error("スケジュールが見つかりませんでした");
          }
          setSchedules(userSchedules);
          setIsLoading(false);
        } else {
          throw new Error("無効なデータ形式");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>エラーが発生しました: {error}</div>;
  }

  const getDayName = (day_of_week_id: string) => {
    const day = daysOfWeek.find(
      (d) => d.day_of_week_id.toString() === day_of_week_id
    );
    return day ? day.name : "Unknown";
  };

  const aggregatedSchedules = schedules.reduce((acc, schedule) => {
    const dayName = getDayName(schedule.day_of_week_id);
    if (acc[dayName]) {
      acc[dayName] += schedule.duration;
    } else {
      acc[dayName] = schedule.duration;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div>
        <CreateSchedulePage />
      </div>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">
          目標学習時間
        </h1>
        {Object.entries(aggregatedSchedules).length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {daysOfWeek.map((day) => {
              const dayName = day.name;
              const totalDuration = aggregatedSchedules[dayName] || 0;
              return (
                <li
                  key={day.day_of_week_id}
                  className="py-4 flex justify-between items-center"
                >
                  <span className="text-lg font-medium text-gray-800">
                    {dayName}
                  </span>
                  <span className="text-lg font-semibold text-blue-500">
                    {totalDuration} 時間
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-gray-600">目標が記録されていません</p>
        )}
      </div>
    </div>
  );
};

export default ScheduleList;
