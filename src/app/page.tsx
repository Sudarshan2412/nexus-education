import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Categories } from "@/components/home/Categories";
import { CTA } from "@/components/home/CTA";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Categories />
      {!session && <CTA />}

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 Nexus Education. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
