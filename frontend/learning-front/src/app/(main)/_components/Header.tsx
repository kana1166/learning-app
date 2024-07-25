/** @format */

"use client";

import Link from "next/link";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header>
      <nav className="bg-gray-400 h-12 flex items-center justify-center">
        <ul className="flex space-x-8 text-white ">
          <li>
            <Link href="/mypage">マイページ</Link>
          </li>
          <li>
            <Link href="/records">記録一覧</Link>
          </li>
          <li>
            <Link href="/scheduleList">スケジュールリスト</Link>
          </li>
          <li>
            <Link href="/record">学習記録登録</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="text-white">
              ログアウト
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
