import type { ReactNode } from "react";

export type ReactChildren = Readonly<{ children: ReactNode }>;

export type TriggerType = "context-menu" | "dropdown";
