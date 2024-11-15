import GetStartedButton from "@/components/GetStartedButton";
import HomeLogo from "@/components/HomeLogo";
import BenefitSection from "@/app/BenefitSection";
import ImpactSection from "./ImpactSection";
import DemoSection from "./DemoSection";

export default async function Home() {
  return (
    <>
      <div className="relative flex w-full flex-col items-center justify-center sm:px-20 xl:px-24">
        <section
          id="hero"
          className="flex min-h-screen w-full max-w-[1000px] flex-shrink flex-col items-center justify-center lg:flex-row lg:justify-between xl:max-w-[1200px]"
        >
          <div className="flex flex-col max-lg:items-center">
            <h1 className="text-3xl font-semibold max-lg:text-center max-sm:max-w-[15ch] sm:w-[20ch] sm:text-4xl xl:w-[20ch] xl:text-5xl xl:leading-tight">
              The fastest way to turn any song into sheet music
            </h1>
            <p className="mt-4 w-[30ch] text-base text-card-foreground max-xl:leading-snug max-lg:text-center sm:text-lg xl:mt-6 xl:text-2xl">
              A web app for musicians to jump start the process of transcribing
              music.
            </p>
            <GetStartedButton />
          </div>
          <HomeLogo />
        </section>
        <BenefitSection />
        <DemoSection />
        <ImpactSection />
        <section
          id="CTA"
          className="flex h-[60vh] w-screen flex-col items-center justify-start bg-[hsl(12,6%,15%)] px-5 pt-[8vh] dark:bg-[hsl(50,10%,92%)] max-lg:-translate-y-1 sm:pt-4 lg:w-[calc(100vw-12px)]"
        >
          <div className="flex flex-col items-center p-4 sm:p-6 xl:p-8">
            <h1 className="max-w-[30ch] text-center text-2xl font-semibold leading-tight text-background sm:text-3xl xl:text-4xl">
              Experience effortless music transcription
            </h1>
            <GetStartedButton reverseTheme />
          </div>
        </section>
      </div>
    </>
  );
}
