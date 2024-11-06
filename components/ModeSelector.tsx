import Bass from "@/components/Bass";
import { AudioLines, Check, Drum, Guitar, MicVocal, Piano } from "lucide-react";
import type { SeparationMode } from "@/utils/types";
import { Badge } from "@/components/ui/badge";

const iconMap = {
  AudioLines,
  MicVocal,
  Bass,
  Drum,
  Guitar,
  Piano,
};

const iconClassName = "w-10 h-10 stroke-stone-500 dark:stroke-stone-400";

const modeData: Record<
  SeparationMode,
  { title: string; iconNames: (keyof typeof iconMap)[] }
> = {
  Solo: {
    title: "Solo",
    iconNames: ["AudioLines"],
  },
  Duet: {
    title: "Duet",
    iconNames: ["MicVocal", "AudioLines"],
  },
  "Small Band": {
    title: "Small Band",
    iconNames: ["MicVocal", "Bass", "Drum", "AudioLines"],
  },
  "Full Band": {
    title: "Full Band",
    iconNames: ["MicVocal", "Guitar", "Bass", "Piano", "Drum"],
  },
};
const selectedClassName = "outline-green-400 dark:outline-green-600 ";
const figureClassName =
  "relative w-full rounded-2xl bg-accent p-6 pt-3 transition-all outline outline-4 cursor-pointer box-border shadow-lg dark:shadow-stone-900 ";
const figcaptionClassName =
  "pb-1 font-bold uppercase text-stone-600 dark:text-stone-500";
const iconContainerClassName =
  "flex w-full items-center justify-center space-x-4";

interface Props {
  mode: SeparationMode;
  selectedMode: SeparationMode | null;
  setSelectedMode: (mode: SeparationMode | null) => void;
  hoveredMode: SeparationMode | null;
  setHoveredMode: (mode: SeparationMode | null) => void;
}

export default function ModeSelector({
  mode,
  selectedMode,
  setSelectedMode,
  hoveredMode,
  setHoveredMode,
}: Props) {
  const { title, iconNames } = modeData[mode];
  const isSelected = selectedMode === mode;
  const figureClass = isSelected
    ? `${figureClassName} ${selectedClassName}`
    : `${figureClassName} outline-transparent `;
  const opacity =
    hoveredMode !== null && hoveredMode !== mode ? "opacity-50" : "";

  return (
    <div
      onMouseEnter={() => {
        if (!selectedMode) {
          setHoveredMode(mode);
        }
      }}
      onMouseLeave={() => {
        if (!selectedMode) {
          setHoveredMode(null);
        }
      }}
      className="w-full py-4 lg:w-3/4"
    >
      <figure
        onClick={() => {
          if (selectedMode === mode) {
            setSelectedMode(null);
          } else {
            setSelectedMode(mode);
            setHoveredMode(mode);
          }
        }}
        className={`${figureClass}${opacity}`}
      >
        <figcaption className={figcaptionClassName}>{title}</figcaption>
        <div className={iconContainerClassName}>
          {iconNames.map((iconName) => {
            const IconComponent = iconMap[iconName];
            return <IconComponent className={iconClassName} key={iconName} />;
          })}
        </div>
      </figure>
    </div>
  );
}
