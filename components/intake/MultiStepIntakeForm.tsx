"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceType } from "@prisma/client";
import { submitIntake } from "@/lib/api";
import {
  SERVICE_DESCRIPTIONS,
  SERVICE_LABELS,
  type IntakeData,
} from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type MultiStepIntakeFormProps = {
  chefId: string;
  chefName?: string;
  activeServices?: ServiceType[];
};

const ALL_SERVICES: ServiceType[] = [
  "PRIVATE_DINNER",
  "MEAL_PREP",
  "COOKING_CLASS",
];

export function MultiStepIntakeForm({
  chefId,
  chefName,
  activeServices = ALL_SERVICES,
}: MultiStepIntakeFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [headcount, setHeadcount] = useState("");

  const [intakeData, setIntakeData] = useState<IntakeData>({});

  const availableServices = ALL_SERVICES.filter((s) =>
    activeServices.includes(s)
  );

  function updateIntake(key: string, value: string | string[] | number) {
    setIntakeData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!serviceType) return;
    setError("");
    setIsLoading(true);

    try {
      const result = await submitIntake({
        chefId,
        serviceType,
        name,
        email,
        phone: phone || undefined,
        eventDate,
        headcount: parseInt(headcount, 10),
        intakeData,
      });
      router.push(`/proposal/${result.eventId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      <header className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Begin Your Experience
        </p>
        <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          Request a Chef
        </h1>
        {chefName && (
          <p className="mt-4 text-muted-foreground">
            with <span className="text-foreground">{chefName}</span>
          </p>
        )}
      </header>

      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-0.5 w-16 transition-colors ${
              step >= s ? "bg-accent" : "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="mx-auto max-w-xl space-y-10 rounded-sm border border-border bg-card p-8 lg:p-12">
        {step === 1 && (
          <div className="space-y-8">
            <h2 className="font-serif text-2xl font-medium text-foreground">
              Select Your Service
            </h2>
            <div className="space-y-4">
              {availableServices.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => setServiceType(service)}
                  className={`w-full p-6 text-left transition-all duration-200 ${
                    serviceType === service
                      ? "bg-foreground text-primary-foreground shadow-soft-lg"
                      : "border border-border bg-secondary hover:border-foreground"
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-widest opacity-70">
                    {SERVICE_LABELS[service]}
                  </p>
                  <p
                    className={`mt-2 text-sm ${
                      serviceType === service ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {SERVICE_DESCRIPTIONS[service]}
                  </p>
                </button>
              ))}
            </div>
            <Button
              onClick={() => setStep(2)}
              disabled={!serviceType}
              className="w-full"
              size="lg"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <h2 className="font-serif text-2xl font-medium text-foreground">
              Your Details
            </h2>
            <div className="space-y-6">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Chen"
                required
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
              <Input
                label={
                  serviceType === "MEAL_PREP"
                    ? "Start Date"
                    : serviceType === "COOKING_CLASS"
                      ? "Class Date"
                      : "Event Date"
                }
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
              <Input
                label={
                  serviceType === "MEAL_PREP"
                    ? "Household Size"
                    : serviceType === "COOKING_CLASS"
                      ? "Number of Participants"
                      : "Number of Guests"
                }
                type="number"
                min="1"
                value={headcount}
                onChange={(e) => setHeadcount(e.target.value)}
                placeholder="12"
                required
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!name || !email || !eventDate || !headcount}
                className="flex-1"
                size="lg"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && serviceType && (
          <div className="space-y-8">
            <h2 className="font-serif text-2xl font-medium text-foreground">
              {serviceType === "PRIVATE_DINNER" && "Dining Preferences"}
              {serviceType === "MEAL_PREP" && "Meal Prep Details"}
              {serviceType === "COOKING_CLASS" && "Class Preferences"}
            </h2>

            {serviceType === "PRIVATE_DINNER" && (
              <div className="space-y-6">
                <Input
                  label="Allergies"
                  placeholder="shellfish, tree nuts (comma-separated)"
                  onChange={(e) => updateIntake("allergies", e.target.value)}
                />
                <Textarea
                  label="Dietary Preferences"
                  placeholder="Pescatarian, gluten-free options..."
                  rows={3}
                  onChange={(e) =>
                    updateIntake("dietaryPreferences", e.target.value)
                  }
                />
                <Textarea
                  label="Kitchen Equipment"
                  placeholder="Gas range, double oven, outdoor grill..."
                  rows={3}
                  onChange={(e) =>
                    updateIntake("kitchenEquipment", e.target.value)
                  }
                />
                <Input
                  label="Occasion"
                  placeholder="Anniversary, birthday celebration..."
                  onChange={(e) => updateIntake("occasion", e.target.value)}
                />
              </div>
            )}

            {serviceType === "MEAL_PREP" && (
              <div className="space-y-6">
                <Textarea
                  label="Preferred Delivery Days"
                  placeholder="Monday, Wednesday, Friday"
                  rows={2}
                  onChange={(e) =>
                    updateIntake(
                      "deliveryDays",
                      e.target.value.split(",").map((d) => d.trim())
                    )
                  }
                />
                <Input
                  label="Container Preference"
                  placeholder="Glass provided by chef, own containers..."
                  onChange={(e) =>
                    updateIntake("containerPreference", e.target.value)
                  }
                />
                <Input
                  label="Refrigerator Space"
                  placeholder="Full-size refrigerator, mini fridge..."
                  onChange={(e) => updateIntake("fridgeSpace", e.target.value)}
                />
                <Input
                  label="Servings Per Week"
                  type="number"
                  min="1"
                  placeholder="10"
                  onChange={(e) =>
                    updateIntake("servingsPerWeek", parseInt(e.target.value, 10))
                  }
                />
                <Textarea
                  label="Dietary Restrictions"
                  placeholder="Gluten-free, dairy-free..."
                  rows={2}
                  onChange={(e) =>
                    updateIntake("dietaryRestrictions", e.target.value)
                  }
                />
              </div>
            )}

            {serviceType === "COOKING_CLASS" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Skill Level
                  </label>
                  <select
                    className="w-full rounded-sm border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                    onChange={(e) => updateIntake("skillLevel", e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select level
                    </option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <Input
                  label="Cuisine Interest"
                  placeholder="Italian pasta, French pastry..."
                  onChange={(e) =>
                    updateIntake("cuisineInterest", e.target.value)
                  }
                />
                <Textarea
                  label="Equipment Available"
                  placeholder="Commercial kitchen, home kitchen..."
                  rows={2}
                  onChange={(e) =>
                    updateIntake("equipmentAvailable", e.target.value)
                  }
                />
                <Input
                  label="Group Type"
                  placeholder="Date night, corporate team building..."
                  onChange={(e) => updateIntake("groupType", e.target.value)}
                />
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                isLoading={isLoading}
                className="flex-1"
                size="lg"
              >
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
