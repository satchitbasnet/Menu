import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MOCK_CHEF_ID } from "@/lib/mock-data";

const SERVICES = [
  {
    title: "Private Dinners",
    desc: "A restaurant-grade experience in the intimacy of your own home. Your chef handles everything — sourcing, cooking, service.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=440&fit=crop&auto=format",
  },
  {
    title: "Weekly Meal Prep",
    desc: "Fresh, nutritionist-aligned meals prepared in your kitchen every week. No subscriptions, no compromises.",
    image:
      "https://images.unsplash.com/photo-1771762211132-2f0598b44dbb?w=600&h=440&fit=crop&auto=format",
  },
  {
    title: "Cooking Classes",
    desc: "Private lessons with a classically-trained chef. Learn technique, not recipes. One session changes how you cook forever.",
    image:
      "https://images.unsplash.com/photo-1683624328172-88fb24625ec1?w=600&h=440&fit=crop&auto=format",
  },
];

const FEATURED_CHEFS = [
  {
    name: "Chef Elena Martinez",
    title: "Mediterranean · Farm-to-Table",
    rating: 4.97,
    reviews: 62,
    from: 145,
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=520&fit=crop&auto=format",
    href: `/intake/${MOCK_CHEF_ID}`,
  },
  {
    name: "Chef Marcus Webb",
    title: "New American · California",
    rating: 4.92,
    reviews: 48,
    from: 110,
    image:
      "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=400&h=520&fit=crop&auto=format",
    href: "/explore",
  },
  {
    name: "Chef Yuki Tanaka",
    title: "Japanese · Omakase",
    rating: 5.0,
    reviews: 31,
    from: 145,
    image:
      "https://images.unsplash.com/photo-1654922207993-2952fec328ae?w=400&h=520&fit=crop&auto=format",
    href: "/explore",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Chef Elena turned our anniversary dinner into something neither of us will ever forget. Every course was flawless.",
    author: "Alexandra H.",
    city: "Beverly Hills, CA",
  },
  {
    quote:
      "I've tried every meal-prep service in LA. Nothing comes close to having a private chef do it in my own kitchen.",
    author: "Marcus C.",
    city: "Venice, CA",
  },
  {
    quote:
      "One cooking class and I finally understand what 'building flavor' means. Worth every penny.",
    author: "Priya N.",
    city: "Santa Monica, CA",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar sticky />

      {/* Hero */}
      <section className="mx-auto max-w-screen-xl px-5 md:px-10">
        <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:min-h-[680px] lg:grid-cols-2">
          <div className="flex flex-col justify-center py-16 md:py-20 lg:pr-16">
            <div className="mb-6 inline-flex items-center gap-2">
              <div className="h-px w-4 bg-muted-foreground/50" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Private Culinary Experiences
              </span>
            </div>
            <h1 className="mb-6 font-serif text-4xl font-normal leading-[1.1] text-foreground sm:text-5xl md:text-6xl">
              Your private chef,
              <br />
              <em>on your terms.</em>
            </h1>
            <p className="mb-10 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Book world-class private chefs for intimate dinners, weekly meal
              prep, and hands-on cooking classes — all in the comfort of your
              home.
            </p>
            <div className="mb-12 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup?role=CLIENT"
                className="flex items-center justify-center gap-2 rounded-sm bg-foreground px-7 py-3.5 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-foreground/90"
              >
                Book a Chef
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/signup?role=CHEF"
                className="flex items-center justify-center gap-2 rounded-sm border border-border px-7 py-3.5 text-sm tracking-wide text-foreground transition-colors hover:border-foreground"
              >
                Join as a Chef
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className="fill-foreground text-foreground"
                  />
                ))}
                <span className="ml-1 text-sm text-foreground">4.96</span>
              </div>
              <p className="text-xs text-muted-foreground">
                From 1,200+ verified reviews
              </p>
              <div className="border-l border-border pl-6">
                <p className="text-sm text-foreground">140+</p>
                <p className="text-xs text-muted-foreground">Vetted chefs</p>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-y-8 left-4 right-0 overflow-hidden rounded-sm bg-secondary">
              <Image
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&h=900&fit=crop&auto=format"
                alt="Private chef preparing a dish"
                fill
                className="object-cover"
                priority
                sizes="50vw"
              />
              <div className="absolute bottom-8 left-8 max-w-[220px] rounded-sm border border-border bg-background p-4 shadow-soft">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-foreground">
                    <span className="font-serif text-xs text-primary-foreground">
                      EM
                    </span>
                  </div>
                  <div>
                    <p className="text-xs leading-none text-foreground">
                      Chef Elena M.
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Beverly Hills
                    </p>
                  </div>
                </div>
                <div className="mb-1 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className="fill-foreground text-foreground"
                    />
                  ))}
                </div>
                <p className="text-xs leading-snug text-muted-foreground">
                  &ldquo;An unforgettable evening. Every detail perfect.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-screen-xl px-5 py-16 md:px-10 md:py-24">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                What We Offer
              </p>
              <h2 className="font-serif text-3xl font-normal text-foreground md:text-4xl">
                Three ways to experience
                <br className="hidden md:block" /> a private chef
              </h2>
            </div>
            <Link
              href="/explore"
              className="flex items-center gap-1 whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse all chefs <ChevronRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {SERVICES.map((svc) => (
              <div key={svc.title} className="group">
                <div
                  className="mb-5 overflow-hidden rounded-sm bg-secondary"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    width={600}
                    height={440}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-2 font-serif text-xl font-normal text-foreground">
                  {svc.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {svc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-screen-xl px-5 py-16 md:px-10 md:py-24">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
              The Process
            </p>
            <h2 className="font-serif text-3xl font-normal text-foreground md:text-4xl">
              Simple from start to supper
            </h2>
          </div>
          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            <div className="absolute top-5 right-[calc(16.67%+12px)] left-[calc(16.67%+12px)] hidden h-px bg-border md:block" />
            {[
              {
                n: "01",
                heading: "Browse & Choose",
                body: "Explore vetted private chefs by specialty, location, and service type.",
              },
              {
                n: "02",
                heading: "Submit Your Brief",
                body: "Complete a short intake form with your date, preferences, and dietary needs.",
              },
              {
                n: "03",
                heading: "Receive a Proposal",
                body: "Your chef sends a tiered menu proposal. Confirm and pay a deposit.",
              },
            ].map(({ n, heading, body }) => (
              <div
                key={n}
                className="flex flex-col items-start gap-4 md:items-center md:text-center"
              >
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border bg-background">
                  <span className="font-serif text-sm text-muted-foreground">
                    {n}
                  </span>
                </div>
                <div>
                  <h3 className="mb-2 font-serif text-lg font-normal text-foreground">
                    {heading}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured chefs */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-screen-xl px-5 py-16 md:px-10 md:py-24">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                Our Chefs
              </p>
              <h2 className="font-serif text-3xl font-normal text-foreground md:text-4xl">
                Curated talent, verified craft
              </h2>
            </div>
            <Link
              href="/explore"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View all chefs <ChevronRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_CHEFS.map((chef) => (
              <Link
                key={chef.name}
                href={chef.href}
                className="group block overflow-hidden rounded-sm border border-border bg-background transition-shadow hover:shadow-soft-lg"
              >
                <div
                  className="overflow-hidden bg-secondary"
                  style={{ aspectRatio: "3/4", maxHeight: 320 }}
                >
                  <Image
                    src={chef.image}
                    alt={chef.name}
                    width={400}
                    height={520}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ maxHeight: 320 }}
                  />
                </div>
                <div className="p-5">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <p className="font-serif text-lg font-normal leading-snug text-foreground">
                      {chef.name}
                    </p>
                    <div className="mt-0.5 flex flex-shrink-0 items-center gap-1">
                      <Star size={11} className="fill-foreground text-foreground" />
                      <span className="text-xs text-foreground">{chef.rating}</span>
                    </div>
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">{chef.title}</p>
                  <p className="text-sm text-muted-foreground">
                    From <span className="text-foreground">${chef.from}</span>
                    <span> / person</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1536392706976-e486e2ba97af?w=1400&h=600&fit=crop&auto=format"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-screen-xl px-5 py-16 md:px-10 md:py-24">
          <p className="mb-12 text-center text-xs uppercase tracking-widest text-muted-foreground">
            What Clients Say
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map(({ quote, author, city }) => (
              <div
                key={author}
                className="rounded-sm border border-border bg-background/80 p-7 backdrop-blur"
              >
                <div className="mb-5 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className="fill-foreground text-foreground"
                    />
                  ))}
                </div>
                <p className="mb-5 font-serif text-lg font-normal italic leading-relaxed text-foreground">
                  &ldquo;{quote}&rdquo;
                </p>
                <p className="text-sm text-foreground">{author}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual CTA */}
      <section className="border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex min-h-[320px] flex-col justify-between bg-foreground px-8 py-16 md:px-14 md:py-20">
            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-white/50">
                For Clients
              </p>
              <h2 className="mb-4 font-serif text-3xl font-normal leading-tight text-white md:text-4xl">
                Ready to book
                <br />
                your chef?
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-white/65">
                Browse chefs in your city, fill out a brief, and receive a custom
                proposal within 24 hours.
              </p>
            </div>
            <Link
              href="/signup?role=CLIENT"
              className="mt-8 inline-flex items-center gap-2 self-start rounded-sm bg-white px-6 py-3 text-sm tracking-wide text-foreground transition-colors hover:bg-white/90"
            >
              Find a Chef
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex min-h-[320px] flex-col justify-between border-l border-border bg-secondary px-8 py-16 md:px-14 md:py-20">
            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
                For Chefs
              </p>
              <h2 className="mb-4 font-serif text-3xl font-normal leading-tight text-foreground md:text-4xl">
                Grow your private
                <br />
                chef practice.
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Join chefs earning on their schedule. Keep 90% of every booking.
                Your craft, your clients.
              </p>
            </div>
            <Link
              href="/signup?role=CHEF"
              className="mt-8 inline-flex items-center gap-2 self-start rounded-sm bg-foreground px-6 py-3 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-foreground/90"
            >
              Apply as a Chef
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-screen-xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center md:px-10">
          <div>
            <span className="font-serif text-base tracking-tight text-foreground">
              Menu<span className="mx-1 text-muted-foreground">·</span>To
              <span className="mx-1 text-muted-foreground">·</span>Table
            </span>
            <p className="mt-1.5 text-xs text-muted-foreground">
              © 2026 Menu-To-Table, Inc.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href="/explore" className="transition-colors hover:text-foreground">
              Browse Chefs
            </Link>
            <Link href="/signup?role=CHEF" className="transition-colors hover:text-foreground">
              For Chefs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
