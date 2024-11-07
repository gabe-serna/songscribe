// rc-knob.d.ts
declare module "rc-knob" {
  import { ReactNode, FC } from "react";

  interface KnobProps {
    min?: number;
    max?: number;
    value?: number;
    angleOffset?: number;
    angleRange?: number;
    size?: number;
    steps?: number;
    snap?: boolean;
    ariaValueText?: string;
    ariaLabelledBy?: string;
    onChange?: (value: number) => void;
    className?: string;
    children?: ReactNode;
  }

  interface PointerProps {
    width?: number;
    height?: number;
    angleOffset?: number;
    angleRange?: number;
    percentage?: number;
    radius?: number;
    center?: number;
    type?: "rect" | "circle";
    color?: string;
    className?: string;
  }

  interface ScaleProps {
    angleRange?: number;
    steps?: number;
    type?: "rect" | "circle";
    radius?: number;
    tickWidth?: number;
    tickHeight?: number;
    angleOffset?: number;
    center?: number;
    color?: string;
    activeColor?: string;
    className?: string;
    activeClassName?: string;
    fn?: (props: any) => ReactNode;
    percentage?: number;
  }

  interface ArcProps {
    color?: string;
    background?: string;
    percentage?: number;
    angleOffset?: number;
    angleRange?: number;
    radius?: number;
    arcWidth?: number;
    center?: number;
  }

  interface ValueProps {
    value?: number;
    size?: number;
    decimalPlace?: number;
    className?: string;
    marginBottom?: number;
  }

  export const Knob: FC<KnobProps>;
  export const Pointer: FC<PointerProps>;
  export const Scale: FC<ScaleProps>;
  export const Arc: FC<ArcProps>;
  export const Value: FC<ValueProps>;
}
