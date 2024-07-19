/** @format */

// components/Header.js

import Link from "next/link";

const Header = () => {
  return (
    <header>
      <nav className="bg-blue-200">
        <ul className="flex space-x-4">
          <li>
            <Link href="/">ホーム</Link>
          </li>
          <li>
            <Link href="/mypage">マイページ</Link>
          </li>
          <li>
            <Link href="/schedule">スケジュール登録</Link>
          </li>
          <li>
            <Link href="/scheduleList">スケジュールリスト</Link>
          </li>
          <li>
            <Link href="/record">記録</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
