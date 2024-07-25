/** @format */

"use client";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../context/UserContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { isSameDay } from "date-fns";
import "../../styles/loginCalendar.css";

interface Record {
  record_id: string;
  user_id: string;
  date: string;
  duration: number;
  note: string;
}

const RecordPage = () => {
  const { userId } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedData = useRef(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

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

  const handleDateClick = (date: Date) => {
    if (selectedDate && isSameDay(selectedDate, date)) {
      // 既に選択されている日付を再度クリックした場合、選択を解除する
      setSelectedDate(null);
      setSelectedRecord(null);
    } else {
      // 新しい日付をクリックした場合、その日付のレコードを表示する
      setSelectedDate(date);
      const record = records.find((r) => isSameDay(new Date(r.date), date));
      setSelectedRecord(record || null);
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const record = records.find((r) => isSameDay(new Date(r.date), date));
      const today = new Date();
      if (isSameDay(date, today)) {
        return ""; // 今日の日付にはクラスを適用しない
      }
      return record ? "highlight" : "";
    }
    return "";
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg mt-8">
        <h1 className="text-2xl font-bold mb-4">学習記録カレンダー</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <Calendar
              onClickDay={handleDateClick}
              tileClassName={tileClassName}
            />
            {selectedRecord && (
              <div className="mt-4 p-4 border rounded-lg shadow">
                <h2 className="text-xl font-bold">記録詳細</h2>
                <p className="text-gray-700">
                  <span className="font-semibold">日付:</span>{" "}
                  {selectedRecord.date}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">学習時間:</span>{" "}
                  {selectedRecord.duration} 時間
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">学習内容:</span>
                  <br />{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: selectedRecord.note
                        .replace(/学習時間詳細:\s\d+:\d+:\d+/g, "")
                        .replace(/\n/g, "<br />")
                        .replace(
                          /合計学習時間:\s(\d+:\d+:\d+)/g,
                          '<span style="float: right;">合計学習時間: $1</span>'
                        ),
                    }}
                  ></span>
                  <br />
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RecordPage;
