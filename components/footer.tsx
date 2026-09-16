import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";

const ARRIVED_URL =
  "https://teamhappily.com/arrived?utm_source=starter-kit&utm_medium=referral&utm_campaign=arrived_sites";

const DARK_LUMINANCE_THRESHOLD = 128;
const MINIMUM_OPAQUE_ALPHA = 0.5;

type FooterProps = {
  baseBackgroundColor: string;
};

export function Footer({ baseBackgroundColor }: FooterProps) {
  const isOnDarkBackground = isDarkBackgroundColor(baseBackgroundColor);
  const logo = isOnDarkBackground ? "/logos/logo-white.svg" : "/logos/logo.svg";

  return (
    <footer className="z-10 mt-auto w-full px-4 py-6 md:px-10 md:py-8">
      <div className="flex items-center justify-center">
        <a
          href={ARRIVED_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group/arrived inline-flex w-fit max-w-full flex-wrap items-center justify-center gap-2"
        >
          <Image
            src={logo}
            alt="Happily Arrived"
            width={217}
            height={28}
            className="h-5 w-auto shrink-0"
            draggable={false}
          />
          <span className="flex items-center gap-1">
            <span className="text-sm leading-5 underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 group-hover/arrived:decoration-current group-focus-visible/arrived:decoration-current">
              Make an entrance
            </span>
            <ArrowUpRightIcon
              size={16}
              strokeWidth={1.25}
              className="shrink-0 transition-transform duration-200 group-hover/arrived:translate-x-0.5 group-hover/arrived:-translate-y-0.5"
            />
          </span>
        </a>
      </div>
    </footer>
  );
}

type ColorChannels = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

function isDarkBackgroundColor(color: string) {
  const channels = parseColorChannels(color);

  if (!channels || channels.alpha < MINIMUM_OPAQUE_ALPHA) {
    return false;
  }

  return perceivedLuminance(channels) < DARK_LUMINANCE_THRESHOLD;
}

function perceivedLuminance({ red, green, blue }: ColorChannels) {
  return (red * 299 + green * 587 + blue * 114) / 1000;
}

function parseColorChannels(color: string): ColorChannels | null {
  const normalizedColor = color.trim().toLowerCase();
  return parseHexColor(normalizedColor) ?? parseRgbColor(normalizedColor);
}

function parseHexColor(color: string): ColorChannels | null {
  const hexDigits = color.replace(/^#/, "");

  if (!/^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(hexDigits)) {
    return null;
  }

  const expandedHex =
    hexDigits.length <= 4
      ? hexDigits
          .split("")
          .map((digit) => digit + digit)
          .join("")
      : hexDigits;

  return {
    red: parseInt(expandedHex.substring(0, 2), 16),
    green: parseInt(expandedHex.substring(2, 4), 16),
    blue: parseInt(expandedHex.substring(4, 6), 16),
    alpha:
      expandedHex.length === 8
        ? parseInt(expandedHex.substring(6, 8), 16) / 255
        : 1,
  };
}

function parseRgbColor(color: string): ColorChannels | null {
  const functionArguments = color.match(/^rgba?\(([^)]+)\)$/)?.[1];

  if (!functionArguments) {
    return null;
  }

  const [rawRed, rawGreen, rawBlue, rawAlpha] = functionArguments
    .split(/[\s,/]+/)
    .filter(Boolean);

  if (!rawRed || !rawGreen || !rawBlue) {
    return null;
  }

  const channels = {
    red: parseChannelValue(rawRed),
    green: parseChannelValue(rawGreen),
    blue: parseChannelValue(rawBlue),
    alpha: rawAlpha === undefined ? 1 : parseAlphaValue(rawAlpha),
  };

  return Object.values(channels).every(Number.isFinite) ? channels : null;
}

function parseChannelValue(value: string) {
  return value.endsWith("%")
    ? (parseFloat(value) / 100) * 255
    : parseFloat(value);
}

function parseAlphaValue(value: string) {
  return value.endsWith("%") ? parseFloat(value) / 100 : parseFloat(value);
}
