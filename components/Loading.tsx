import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { infoList } from "@/utils/infoList";

interface Props {
  text?: string;
  dotCount?: number;
}

export default function Loading({ text = "Loading", dotCount = 3 }: Props) {
  const [infoTrigger, setInfoTrigger] = useState(true);
  const infoRef = useRef<HTMLHeadingElement>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [index, setIndex] = useState(-1);
  if (index === -1) {
    setIndex(Math.floor(Math.random() * infoList.length));
  }

  const dots = Array.from({ length: dotCount }, (_, index) => (
    <span
      key={index}
      className="loading-dot"
      style={{ animationDelay: `${0.3 * (index + 1)}s` }}
    >
      .
    </span>
  ));

  const changeInfo = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * infoList.length);
    } while (randomIndex === index);

    setInfo(infoList[randomIndex]);
    setIndex(randomIndex);
    setInfoTrigger(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setInfoTrigger((prev) => !prev);
    }, 12000);

    return () => clearInterval(interval);
  }, [infoTrigger]);

  return (
    <>
      <div className="relative flex items-center text-center text-3xl font-bold transition-all lg:text-4xl">
        <span>{text}</span>
        <span className="absolute ml-2 flex translate-x-36">{dots}</span>
      </div>
      <CSSTransition
        nodeRef={infoRef}
        in={infoTrigger}
        timeout={700}
        classNames="fade"
        onExited={changeInfo}
        unmountOnExit
      >
        <h2
          ref={infoRef}
          className="font-body leading-wide h-20 max-w-[50ch] text-center text-base italic text-card-foreground"
        >
          {info ?? infoList[index]}
        </h2>
      </CSSTransition>
    </>
  );
}
