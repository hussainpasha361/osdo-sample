"use client";

import { useId, useState } from "react";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Visually complete, accessible enquiry form. There is no backend yet, so a
 * valid submission says plainly that nothing was sent.
 */
export default function InquiryForm() {
  const id = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(f.get("name") ?? "").trim()) next.name = "Enter your name.";
    const email = String(f.get("email") ?? "").trim();
    if (!email) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter an email address like name@example.com.";
    if (!String(f.get("message") ?? "").trim()) next.message = "Tell us a little about the project.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }
    setDone(true);
  };

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="field-error">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-9" aria-describedby={`${id}-note`}>
      <div className="grid gap-9 md:grid-cols-2 md:gap-x-8">
        <div className="field">
          <label htmlFor={`${id}-name`}>Name</label>
          <input id={`${id}-name`} name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-err` : undefined} />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor={`${id}-phone`}>
            Phone <span className="opacity-60">(optional)</span>
          </label>
          <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor={`${id}-loc`}>
            Project location <span className="opacity-60">(optional)</span>
          </label>
          <input id={`${id}-loc`} name="location" />
        </div>
      </div>

      <fieldset className="grid gap-3 border-0 p-0 m-0">
        <legend className="text-[14px] text-graphite mb-3">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {["Architecture", "Interior design", "Both"].map((o, i) => (
            <label key={o} className="chip-choice">
              <input type="radio" name="scope" value={o} defaultChecked={i === 2} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor={`${id}-msg`}>About the project</label>
        <textarea id={`${id}-msg`} name="message" rows={5} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${id}-message-err` : undefined} />
        {err("message")}
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <button type="submit" className="btn-line text-charcoal">
          <span>Send enquiry</span>
        </button>
        <p id={`${id}-note`} className="t-note text-graphite max-w-[44ch]">
          Preview only: this form is not connected yet, so nothing will be sent.
        </p>
      </div>

      <p role="status" aria-live="polite" className={`t-small ${done ? "" : "sr-only"}`}>
        {done ? "Looks good. The form isn't connected yet, so this enquiry was not sent. Please reach the studio on Instagram for now." : ""}
      </p>
    </form>
  );
}
