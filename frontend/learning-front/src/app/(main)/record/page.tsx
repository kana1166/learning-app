/** @format */

"use client";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../context/UserContext";

interface DayOfWeek {
  day_of_week_id: number;
  name: string;
}
interface Record {
  record_id: string;
  user_id: string;
  date: string;
  duration: number;
  note: string;
}

const CreateRecordPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [duration, setDuration] = useState(0);
  const [dayOfWeek, setDayOfWeek] = useState<string>("");
  const [note, setNote] = useState("");
  const { userId } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedData = useRef(false);
  const [records, setRecords] = useState<Record[]>([]);

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

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/records`;
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

        if (Array.isArray(data)) {
          // 特定のユーザーIDに基づいてスケジュールをフィルタリング
          const userRecords = data.filter(
            (records: Record) => records.user_id === userId
          );
          setRecords(userRecords);
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

  useEffect(() => {
    if (selectedDate) {
      const dayOfWeekId = getDayOfWeekId(selectedDate);
      const dayName = getDayName(dayOfWeekId);
      setDayOfWeek(dayName);
    } else {
      setDayOfWeek("");
    }
  }, [selectedDate]);

  const getDayName = (day_of_week_id: number): string => {
    const day = daysOfWeek.find((d) => d.day_of_week_id === day_of_week_id);
    return day ? day.name : "Unknown";
  };

  const getDayOfWeekId = (date: string): number => {
    const dayOfWeek = new Date(date).getDay(); // 0 (日曜日) から 6 (土曜日) までの値を返す
    return dayOfWeek === 0 ? 7 : dayOfWeek; // 日曜日を7とし、他の曜日はそのまま
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      setError("有効な日付を選択してください");
      return;
    }

    const dayOfWeekId = getDayOfWeekId(selectedDate);
    const newRecord = {
      user_id: userId,
      day_of_week_id: dayOfWeekId,
      duration: duration,
      date: selectedDate,
      note: note,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRecord),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecords([...records, data]);
      setSelectedDate("");
      setDuration(0);
      setDayOfWeek("");
      setNote("");
      setError(null);
    } catch (error) {
      console.error("Error creating record:", error);
      setError("レコードの作成に失敗しました");
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg mt-8">
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              日付:
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {dayOfWeek && (
              <p className="mt-2 text-sm text-gray-700">曜日: {dayOfWeek}</p>
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700"
            >
              学習時間:
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              学習内容:
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              記録する
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateRecordPage;
