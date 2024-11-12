import GetStartedButton from "@/components/GetStartedButton";
import HomeLogo from "@/components/HomeLogo";

export default async function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center sm:px-20 xl:px-24">
      <section
        id="hero"
        className="flex w-full max-w-[1000px] flex-shrink flex-col items-center justify-between lg:flex-row xl:max-w-[1200px]"
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
    </div>
  );
}
