/** @format */

"use client";
import { useUser } from "../../../context/UserContext";
import { useEffect, useState, useRef } from "react";

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

const CreateSchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const { userId } = useUser();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedData = useRef(false);

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

  const getDayName = (day_of_week_id: string): string => {
    const day = daysOfWeek.find(
      (d) => d.day_of_week_id.toString() === day_of_week_id
    );
    return day ? day.name : "Unknown";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Creating schedule...");
    console.log("Selected day:", selectedDay);
    console.log("Duration:", duration);
    console.log("User ID:", userId);

    const selectedDayObject = daysOfWeek.find(
      (day) => day.name === selectedDay
    );

    if (!selectedDayObject) {
      setError("有効な曜日を選択してください");
      return;
    }

    const newSchedule = {
      user_id: userId,
      day_of_week_id: selectedDayObject.day_of_week_id,
      duration: duration,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSchedule),
        }
      );

      if (!response.ok) {
        throw new Error("スケジュールの作成に失敗しました");
      }

      const createdSchedule = await response.json();
      setSchedules([...schedules, createdSchedule]);
      setSelectedDay("");
      setDuration(0);
    } catch (error) {
      console.error("Error creating schedule:", error);
      setError("スケジュールの作成中にエラーが発生しました");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>エラーが発生しました: {error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-2">
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            学習予定時間:
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 block w-16 pl-3 pr-3 sm:text-sm border-gray-300 rounded-md"
            placeholder="0"
          />
          <span className="text-sm text-gray-700">時間</span>
        </div>
        <div>
          <label
            htmlFor="daysOfWeek"
            className="block text-sm font-medium text-gray-700"
          >
            学習予定曜日:
          </label>
          <select
            id="daysOfWeek"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">選択してください</option>
            {daysOfWeek.map((day) => (
              <option key={day.day_of_week_id} value={day.name}>
                {day.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Schedule
        </button>
      </form>
    </div>
  );
};

export default CreateSchedulePage;
