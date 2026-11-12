import Image from "next/image";
import { UserData } from "@/lib/data";

const socials = (user: UserData) => [
  { label: "GitHub", href: user.github_url },
  { label: "LinkedIn", href: user.linkedin_url },
  { label: "X", href: "https://x.com/prathahahaham" },
  { label: "Instagram", href: "https://www.instagram.com/oye.pratham" },
];

export default function HeroSection({ userData }: { userData: UserData }) {
  return (
    <section aria-labelledby="hero-title" className="shell section-y">
      <div className="fade-in grid gap-10 lg:grid-cols-[1fr_400px] lg:items-center lg:gap-16">
        <div className="lg:order-first order-last">
          <p className="label mb-8 text-accent">● ML Engineer · MS AI @ Northeastern · Boston, MA</p>
          <h1 id="hero-title" className="font-serif text-display-xl">
            Machine learning, built for <em className="text-accent">the real world</em>.
          </h1>
          {userData.bio && <p className="mt-8 max-w-2xl text-body-l text-muted">{userData.bio}</p>}
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#work" className="btn btn-primary">
              View selected work →
            </a>
            {userData.resume_url && (
              <a href={userData.resume_url} download className="btn">
                Download résumé →
              </a>
            )}
          </div>
        </div>

        {userData.profile_image_url && (
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-hairline lg:w-[400px]">
            <Image
              src={userData.profile_image_url}
              alt={`Portrait of ${userData.full_name || "Pratham Satani"}`}
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>

      <ul className="label mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-hairline pt-6 text-muted">
        {socials(userData).map(
          (social) =>
            social.href && (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  {social.label} ↗
                </a>
              </li>
            )
        )}
      </ul>
    </section>
  );
}
