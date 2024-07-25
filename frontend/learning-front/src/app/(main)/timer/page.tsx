/** @format */

"use client";
import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";

interface Record {
  record_id: string;
  user_id: string;
  date: string;
  duration: number;
  note: string;
}

const CreateTimePage = () => {
  const { userId } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [note, setNote] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [currentSessionTime, setCurrentSessionTime] =
    useState<string>("00:00:00");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/records`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const currentTime = Date.now() - (startTime ?? Date.now());
        setElapsedTime(currentTime);
        setCurrentSessionTime(formatTime(currentTime));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, startTime]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setStartTime(Date.now() - elapsedTime);
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - (startTime ?? Date.now()));
      }, 1000);
    }
  };

  const handleStop = () => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setElapsedTime(Date.now() - (startTime ?? Date.now()));
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes}:${seconds}`;
  };

  const sumDurations = (note: string) => {
    const regex = /学習時間詳細:\s(\d+):(\d+):(\d+)/g;
    let match;
    let totalSeconds = 0;

    while ((match = regex.exec(note)) !== null) {
      const [, hours, minutes, seconds] = match.map(Number);
      totalSeconds += hours * 3600 + minutes * 60 + seconds;
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!note) {
      setError("学習内容を入力してください");
      return;
    }

    const date = new Date().toISOString().split("T")[0];
    const duration = Math.ceil(elapsedTime / 3600000); // ミリ秒を時間に変換し、整数に丸める
    const detailedDuration = formatTime(elapsedTime);

    try {
      const existingRecord = records.find(
        (record) => record.date === date && record.user_id === userId
      );

      if (existingRecord) {
        // 既存のレコードがある場合は更新
        existingRecord.duration += duration;
        const newNote = `${note}\n学習時間詳細: ${detailedDuration}`;
        const updatedNote = `${existingRecord.note.trim()}${newNote}`;
        const summedDuration = sumDurations(updatedNote);

        // 合計学習時間の表示を更新
        const noteWithoutTotal = updatedNote
          .replace(/合計学習時間:\s(\d+):(\d+):(\d+)/, "")
          .trim();
        existingRecord.note = `${noteWithoutTotal}\n合計学習時間: ${summedDuration}`;

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/records/${existingRecord.record_id}`;
        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(existingRecord),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedRecord = await response.json();
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.record_id === updatedRecord.record_id
              ? updatedRecord
              : record
          )
        );
      } else {
        // 新しいレコードを作成
        const newRecord = {
          user_id: userId,
          date: date,
          duration: duration,
          note: `${note}\n学習時間詳細: ${detailedDuration}\n合計学習時間: ${detailedDuration}`,
        };

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/records`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRecord),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRecords([...records, data]);
      }

      handleReset();
      setNote("");
      setError(null);
    } catch (error: unknown) {
      console.error("Error creating record:", error);
      if (error instanceof Error) {
        setError("レコードの作成に失敗しました。エラー内容: " + error.message);
      } else {
        setError("レコードの作成に失敗しました。");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg mt-8">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleStart}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={isRunning}
        >
          開始
        </button>
        <button
          onClick={handleStop}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={!isRunning}
        >
          終了
        </button>
        <button
          onClick={handleReset}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          リセット
        </button>
      </div>
      <div className="mb-4">
        <p className="text-xl font-semibold">時間: {formatTime(elapsedTime)}</p>
      </div>
      <form onSubmit={handleSubmit}>
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
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isRunning || elapsedTime === 0}
          >
            記録する
          </button>
        </div>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default CreateTimePage;
