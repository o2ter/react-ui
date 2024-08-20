import type { RendererType } from "lottie-web";
import { ViewProps } from "react-native";
import { Modify } from "../../internals/types";

export type LottieProps = Modify<ViewProps, {
  source: any;
  duration?: number;
  renderer?: RendererType;
  loop?: boolean | number;
  autoPlay?: boolean;
  preserveAspectRatio?: string;
}>;
