/** @format */

"use client";
import React, { useState, useEffect, useRef } from "react";

interface User {
  userId: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [days, setDays] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (hasFetchedData.current) return; // 既にフェッチされている場合は何もしない
    hasFetchedData.current = true; // フェッチを実行したことを記録

    console.log("useEffect called"); // useEffectが呼ばれたことをデバッグ

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/learning_user`;
    console.log("API URL:", apiUrl); // デバッグ用にAPI URLを出力

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          console.error("Response not OK:", res.status, res.statusText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // デバッグ用にデータを出力
        if (data.error) {
          throw new Error(data.error);
        }
        setUser(data[0]); // ここでレスポンスの最初のユーザーを設定
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const toggleUpdateForm = () => {
    setIsUpdateFormVisible(!isUpdateFormVisible);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>ユーザーデータを取得できませんでした。</div>;
  }

  if (error) {
    return <div>エラーが発生しました: {error}</div>;
  }

  return (
    <div>
      <h1>My Page</h1>
      <div>
        <p>UserId: {user.userId}</p>
        <p>Email: {user.email}</p>
        <p>Name: {user.name}</p>
        <p>Account Created: {new Date(user.createdAt).toLocaleString()}</p>
        <p>Last Updated: {new Date(user.updatedAt).toLocaleString()}</p>
        {/* 追加: 削除日時がある場合のみ表示 */}
        {user.deletedAt && (
          <p>Account Deleted: {new Date(user.deletedAt).toLocaleString()}</p>
        )}
      </div>
      <button type="button" onClick={toggleUpdateForm}>
        {isUpdateFormVisible ? "Close Form" : "Update User"}
      </button>
    </div>
  );
};

export default MyPage;
