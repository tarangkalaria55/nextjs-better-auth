import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div>
        <h1>Welcome to Our App</h1>
        <Link href="/auth/login">Sign In / Sign up</Link>
      </div>
    </div>
  );
}
