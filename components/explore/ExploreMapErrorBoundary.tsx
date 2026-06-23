"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { StaticExploreMap } from "@/components/explore/StaticExploreMap";
import type { ExploreChef } from "@/lib/explore-chefs";

type ExploreMapErrorBoundaryProps = {
  children: ReactNode;
  chefs: ExploreChef[];
  hoveredChefId: string | null;
  onHover: (chefId: string | null) => void;
};

type ExploreMapErrorBoundaryState = {
  hasError: boolean;
};

export class ExploreMapErrorBoundary extends Component<
  ExploreMapErrorBoundaryProps,
  ExploreMapErrorBoundaryState
> {
  state: ExploreMapErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ExploreMapErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Explore map failed to load:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <StaticExploreMap
            chefs={this.props.chefs}
            hoveredChefId={this.props.hoveredChefId}
            onHover={this.props.onHover}
          />
          <div className="absolute top-4 left-4 z-20 max-w-xs rounded-sm border border-border/80 bg-card/95 px-3 py-2 text-xs text-muted-foreground shadow-soft backdrop-blur-sm">
            Google Maps could not load. Showing static map instead — check your
            API key and Map ID.
          </div>
        </>
      );
    }

    return this.props.children;
  }
}
