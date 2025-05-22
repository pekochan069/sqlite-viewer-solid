import { Link } from "@tanstack/solid-router";

export default function Header() {
  return (
    <header class="flex justify-between gap-2 bg-white p-2 text-black">
      <nav class="flex flex-row">
        <div class="px-2 font-bold">
          <Link to="/">SQLite</Link>
        </div>
      </nav>
    </header>
  );
}
