import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFCF8] px-6">
      <SignIn routing="path" path="/sign-in" forceRedirectUrl="/workspace" />
    </main>
  );
}
