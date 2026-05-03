import Image from "next/image";
import LinkButton from "@/components/LinkButton";

export default function Home() {
  return (
    <main className="grid grid-cols-3 gap-4 min-h-screen content-start p-4">
      <LinkButton href="/register" text="회원가입" />
      <LinkButton href="/login" text="로그인" />
      <LinkButton href="/auth-test" text="인증/인가 테스트" />
      <LinkButton href="/api-test" text="서버 부하 테스트" />
    </main>
  );
}
