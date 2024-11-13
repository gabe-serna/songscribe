import GetStartedButton from "@/components/GetStartedButton";
import HomeLogo from "@/components/HomeLogo";
import BenefitSection from "@/app/BenefitSection";

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
        <section
          id="impact"
          className="sticky top-0 z-30 flex h-[200vh] w-[calc(100vw-12px)] bg-foreground"
        >
          <div className="sticky top-[30vh] my-[30vh] flex h-[40vh] w-full items-center justify-center bg-yellow-500">
            <h1 className="text-3xl text-background">
              Transcribing takes Hours
            </h1>
          </div>
        </section>
      </div>
    </>
  );
}
