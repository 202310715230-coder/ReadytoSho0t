"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "./utils"; // Pastikan path utils.ts Anda sudah tepat

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-[10px] tracking-tighter font-mono select-none",
          // Gaya Brutalist: Garis Grid sangat tegas & Axis menggunakan font tebal kaku
          "[&_.recharts-cartesian-axis-tick_text]:fill-foreground [&_.recharts-cartesian-axis-tick_text]:font-black [&_.recharts-cartesian-axis-tick_text]:uppercase",
          "[&_.recharts-cartesian-grid_line]:stroke-foreground/20 [&_.recharts-cartesian-grid_line]:stroke-[2px] [&_.recharts-cartesian-grid_line]:stroke-dasharray-none",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-secondary [&_.recharts-curve.recharts-tooltip-cursor]:stroke-[4px]",
          "[&_.recharts-dot]:stroke-foreground [&_.recharts-dot]:stroke-[2px]",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color,
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentPropsWithoutRef<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) return null;
      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      return (
        <div
          className={cn(
            "font-black uppercase italic tracking-widest bg-foreground text-background px-2 py-1 text-[10px] border-b-2 border-foreground",
            labelClassName
          )}
        >
          {labelFormatter ? labelFormatter(value, payload) : value}
        </div>
      );
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          // Tooltip: Kontainer kaku dengan hard shadow pejal
          "border-2 border-foreground bg-card min-w-[12rem] flex flex-col p-0 overflow-hidden shadow-[6px_6px_0_0_rgba(0,0,0,1)] rounded-none",
          className,
        )}
      >
        {/* Render header label tunggal */}
        {tooltipLabel}
        
        {/* 💡 PERBAIKAN: Menambahkan padding atas (pt-3) agar konten isi tidak menempel rapat ke batas header label */}
        <div className="grid gap-1.5 px-3 pt-3 pb-3">
          {payload.map((item) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div key={item.dataKey} className="flex w-full items-center gap-2">
                {!hideIndicator && (
                  <div
                    className={cn("shrink-0 border-2 border-foreground rounded-none", {
                      "h-3 w-3": indicator === "dot",
                      "w-1.5 h-4": indicator === "line",
                      "w-0 h-4 border-l-2 border-dashed": indicator === "dashed",
                    })}
                    style={{
                      backgroundColor: indicator !== "dashed" ? indicatorColor : "transparent",
                    }}
                  />
                )}
                <div className="flex flex-1 justify-between items-end leading-none">
                  <span className="font-bold uppercase text-[9px] tracking-tighter opacity-80">
                    {itemConfig?.label || item.name}
                  </span>
                  <span className="font-mono font-black text-xs text-secondary-foreground bg-secondary px-1 ml-4 border border-foreground shadow-[1px_1px_0_0_#000]">
                    {item.value?.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(({ className, hideIcon = false, payload, nameKey }, ref) => {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      ref={ref}
      className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-6", className)}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            className="flex items-center gap-1.5 bg-muted/50 border border-foreground/10 px-2 py-0.5 rounded-none"
          >
            {!hideIcon && (
              <div
                className="size-2.5 border-2 border-foreground rounded-none"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span className="text-[9px] font-black uppercase tracking-widest font-mono text-foreground">
              {itemConfig?.label || item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined;
  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined;
  let configLabelKey: string = key;
  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }
  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};