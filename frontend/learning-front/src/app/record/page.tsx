/** @format */

"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // DatePickerの追加
import "react-datepicker/dist/react-datepicker.css";

const CreateRecordPage: React.FC = () => {
  const [date, setDate] = useState(new Date()); // デフォルト値を現在の日付に変更
  const [duration, setDuration] = useState(0);
  const [note, setNote] = useState("");

  const [userId, setUserId] = useState("");

  const formatDate = (inputDate: Date) => {
    const isoDateString = inputDate.toISOString();
    return isoDateString;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      userId: userId,
      date: date.toISOString(), // Date型をISO文字列に変換
      duration: duration,
      note: note,
    };

    const response = await fetch("/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to create a record");
    }

    alert("Record created successfully");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userId">userId:</label>
        <input
          type="userId"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        {/* DatePickerコンポーネントを使用 */}
        <DatePicker
          selected={date}
          onChange={(newDate) => {
            if (newDate !== null) {
              setDate(newDate);
            }
          }}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div>
        <label htmlFor="duration">Duration (hours):</label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="note">Note:</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <button type="submit">Create Record</button>
    </form>
  );
};

export default CreateRecordPage;
