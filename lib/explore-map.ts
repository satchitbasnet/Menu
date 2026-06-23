import type { ExploreChef } from "@/lib/explore-chefs";
import { formatCurrency } from "@/lib/format";

export type ExploreMapViewport = {
  center?: { lat: number; lng: number };
  zoom?: number;
  bounds?: google.maps.LatLngBoundsLiteral;
};

export const LA_MAP_CENTER = { lat: 34.0522, lng: -118.35 };
export const LA_MAP_DEFAULT_ZOOM = 11;

export function percentToCoordinates(position: {
  x: number;
  y: number;
}): { lat: number; lng: number } {
  return {
    lat: 33.95 + (position.y / 100) * 0.25,
    lng: -118.55 + (position.x / 100) * 0.45,
  };
}

function applyPricePinStyles(root: HTMLElement, isActive: boolean) {
  const bubble = root.querySelector<HTMLElement>("[data-pin-bubble]");
  const tail = root.querySelector<HTMLElement>("[data-pin-tail]");

  if (bubble) {
    bubble.style.backgroundColor = isActive ? "#1a1a1a" : "#ffffff";
    bubble.style.color = isActive ? "#f9f9f8" : "#1a1a1a";
    bubble.style.borderColor = isActive ? "#1a1a1a" : "#ffffff";
    bubble.style.transform = isActive ? "scale(1.08)" : "scale(1)";
  }

  if (tail) {
    tail.style.backgroundColor = isActive ? "#1a1a1a" : "#ffffff";
  }
}

export function createPricePinElement(
  chef: ExploreChef,
  isActive: boolean
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("data-chef-id", chef.id);
  button.setAttribute(
    "aria-label",
    `${chef.name}, ${formatCurrency(chef.pricePerPerson)} per person`
  );
  button.style.cssText =
    "display:flex;flex-direction:column;align-items:center;border:none;background:transparent;padding:0;cursor:pointer;font-family:inherit;";

  const bubble = document.createElement("span");
  bubble.setAttribute("data-pin-bubble", "true");
  bubble.textContent = formatCurrency(chef.pricePerPerson);
  bubble.style.cssText =
    "display:inline-flex;align-items:center;justify-content:center;border-radius:9999px;padding:4px 10px;font-size:12px;font-weight:600;line-height:1;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.18);border:2px solid #ffffff;transition:transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;";

  const tail = document.createElement("span");
  tail.setAttribute("data-pin-tail", "true");
  tail.style.cssText =
    "display:block;width:10px;height:10px;margin-top:-5px;transform:rotate(45deg);transition:background-color 0.2s ease;";

  button.append(bubble, tail);
  applyPricePinStyles(button, isActive);

  return button;
}

export function updatePricePinElement(
  element: HTMLElement,
  isActive: boolean
) {
  applyPricePinStyles(element, isActive);
}
