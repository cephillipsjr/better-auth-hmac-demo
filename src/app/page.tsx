import { Hero1 } from "@/components/hero1";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 sm:p-20">
      <Hero1
        heading="Better Auth Demo"
        description="Secure, modern authentication using HMAC-signed requests, built with Next.js and Better Auth."
        image={{
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
          alt: "Demo image",
        }}
      />
    </div>
  );
}
