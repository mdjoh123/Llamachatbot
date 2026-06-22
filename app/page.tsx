import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Button } from "@/components/ui/button"
import { MessageSquare, Boxes, Sparkles, ArrowRight, Wand2, Save } from "lucide-react"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isAuthed = !!session?.user

  return (
    <div className="min-h-svh flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Promptverse</span>
        </div>
        <nav className="flex items-center gap-2">
          {isAuthed ? (
            <Button asChild>
              <Link href="/studio">Open Studio</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Wand2 className="size-4 text-primary" />
            Powered by Llama 3
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Create anything with a single <span className="text-primary">prompt</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Promptverse is your AI creation platform. Chat with a smart assistant and generate interactive 3D scenes
            from plain text. No tools, no learning curve — just describe what you imagine.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href={isAuthed ? "/studio" : "/sign-up"}>
                Start creating
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={isAuthed ? "/dashboard" : "/sign-in"}>
                {isAuthed ? "My creations" : "Sign in"}
              </Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-24 md:grid-cols-3">
          <Feature
            icon={<MessageSquare className="size-6 text-primary" />}
            title="AI Chat Assistant"
            desc="Brainstorm, write, code, and learn with a streaming Llama 3 assistant that responds in real time."
          />
          <Feature
            icon={<Boxes className="size-6 text-primary" />}
            title="3D Prompt Generator"
            desc="Describe a scene and watch it come to life as an interactive 3D world you can orbit and explore."
          />
          <Feature
            icon={<Save className="size-6 text-primary" />}
            title="Save & Revisit"
            desc="Every chat and scene is saved to your account so you can pick up exactly where you left off."
          />
        </section>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        Promptverse — built on Vercel with Neon, Better Auth, and the AI SDK.
      </footer>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-left">
      <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-secondary">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  )
}
