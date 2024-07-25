/** @format */

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../../context/UserContext";

interface User {
  userId: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const MyPage = () => {
  const { userId } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [days, setDays] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (hasFetchedData.current) return; // 既にフェッチされている場合は何もしない
    hasFetchedData.current = true; // フェッチを実行したことを記録

    if (!userId) {
      setError("ユーザーIDが見つかりませんでした");
      setIsLoading(false);
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/learning_user`;
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
          // 特定のユーザーIDに基づいてユーザーを検索
          const userData = data.find((user) => user.user_id === userId);
          if (!userData) {
            throw new Error("ユーザーデータが見つかりませんでした");
          }

          const mappedUser: User = {
            userId: userData.user_id,
            email: userData.email,
            name: userData.name,
            createdAt: userData.created_at,
            updatedAt: userData.updated_at,
            deletedAt: userData.deleted_at,
          };

          console.log("Mapped user data:", mappedUser);

          setUser(mappedUser);
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
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">My Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700">
            <span className="font-semibold">UserId:</span> {user.userId}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700">
            <span className="font-semibold">Name:</span> {user.name}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700">
            <span className="font-semibold">Account Created:</span>{" "}
            {new Date(user.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700">
            <span className="font-semibold">Last Updated:</span>{" "}
            {new Date(user.updatedAt).toLocaleString()}
          </p>
        </div>
        {user.deletedAt && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-700">
              <span className="font-semibold">Account Deleted:</span>{" "}
              {new Date(user.deletedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggleUpdateForm}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
        >
          {isUpdateFormVisible ? "Close Form" : "Update User"}
        </button>
      </div>
    </div>
  );
};

export default MyPage;
