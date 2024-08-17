import { BeamSection } from "@/components/dashboard/beam-section";
import BottomSectionLanding from "@/components/landing/bottom-section-landing";
import CallToActionSection from "@/components/landing/cta-section";
import EventsSectionLanding from "@/components/landing/events-section-landing";
import HeroSectionNew2 from "@/components/landing/hero-section";
import { IntegrationsSectionLanding } from "@/components/landing/Integrations-section-landing";
import Particles from "@/components/ui/particles";
import { SphereMask } from "@/components/ui/sphere-mask";

export default async function IndexPage() {

  return (
    <>
      <HeroSectionNew2 />
      <SphereMask />
      <BeamSection />
      <IntegrationsSectionLanding />
      <EventsSectionLanding />
      <CallToActionSection />
      <SphereMask reverse />
      <BottomSectionLanding />

      <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        ease={70}
        size={0.05}
        staticity={40}
        color={"#ffffff"}
      />

      {/* <HeroSection2 /> */}
      {/* <BeamSection /> */}
      {/* <section className="space-y-6 pb-12 pt-16 lg:py-28">
        <div className="container flex max-w-[64rem] flex-col items-center gap-5 text-center">
          <Link
            href="https://twitter.com/codehagen"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            target="_blank"
          >
            Introducing on <Icons.twitter className="ml-2 h-4 w-4" />
          </Link>

          <h1
            className="animate-fade-up font-urban text-4xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            <Balancer>
              Get Alerts, with{" "}
              <span className="relative bg-gradient-to-r from-indigo-500 to-purple-500/80 bg-clip-text font-extrabold text-transparent">
                Dingify
              </span>
            </Balancer>
          </h1>

          <p
            className="max-w-[42rem] animate-fade-up leading-normal text-muted-foreground opacity-0 sm:text-xl sm:leading-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            <Balancer>
              We made it so easy that you can track and get alerts within 60
              seconds after sign up
            </Balancer>
          </p>

          <div
            className="flex animate-fade-up justify-center space-x-2 opacity-0 md:space-x-4"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            <GetStartedButton />
            <Link
              href="https://dingify.io"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-4",
              )}
            >
              <Icons.chevrondown className="mr-2 h-4 w-4" />
              <p>
                <span className="hidden sm:inline-block">Lets explore</span>{" "}
                Dingify{" "}
              </p>
            </Link>
          </div>
        </div>
      </section> */}
      {/* <BusinessLine /> */}
      {/* <section>
        <Featuressection />
      </section>
      <section>
        <CallToActionComponent />
      </section> */}
      {/* <section>
        <FeatureSection1 />
      </section> */}
    </>
  );
}
