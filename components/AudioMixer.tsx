import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import StyledKnob from "@/components/StyledKnob";

interface Props {
  name: string;
  controls: {
    volume: number;
    setVolume: (volume: number) => void;
    pan: number;
    setPan: (pan: number) => void;
  };
}

export default function AudioMixer({ name, controls }: Props) {
  const defaultVolume = [100];
  const { volume, setVolume, pan, setPan } = controls;
  const htmlName = name.toLowerCase().replace(" ", "_");

  return (
    <div className="flex h-full w-max flex-col-reverse items-center justify-center">
      <StyledKnob value={pan} setValue={setPan} />
      <Label htmlFor={htmlName} className="font-heading mt-4 font-bold">
        {name}
      </Label>
      <p className="w-14 text-center text-card-foreground">{volume}</p>
      <Slider
        name={htmlName}
        min={0}
        max={100}
        step={5}
        value={[volume]}
        defaultValue={defaultVolume}
        onValueChange={(val) => setVolume(val[0])}
        orientation="vertical"
      />
    </div>
  );
}
