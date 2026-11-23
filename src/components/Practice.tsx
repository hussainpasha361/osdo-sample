"use client";

import { useState } from "react";
import { Sheet, Lines } from "./ui";
import { services } from "@/data/projects";

/** Disciplines as an accordion on a dark sheet. */
export default function Practice() {
  const [open, setOpen] = useState(0);
  return (
    <section className="practice" id="practice" aria-labelledby="pr-title" data-theme="dark">
      <div className="wrap">
        <Sheet code="A-200" title="Practice" dark />
        <div className="practice-grid">
          <div className="practice-intro">
            <Lines as="h2" className="h-xl" lines={["One office,", <>four <em>scales.</em></>]} />
            <p data-reveal="up">
              From a door handle to a neighbourhood, the same studio draws every scale, so the building, the rooms inside it
              and the ground around it are designed as one.
            </p>
          </div>
          <ul className="acc">
            {services.map((s, i) => {
              const isOpen = open === i;
              return (
                <li key={s.no} className={`acc-item ${isOpen ? "is-open" : ""}`} data-reveal="up">
                  <h3>
                    <button aria-expanded={isOpen} aria-controls={`acc-${i}`} id={`acc-b-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                      <span className="acc-no">{s.no}</span>
                      <span className="acc-title">{s.title}</span>
                      <span className="acc-icon" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="acc-panel" id={`acc-${i}`} role="region" aria-labelledby={`acc-b-${i}`}>
                    <div className="acc-inner">
                      <p>{s.body}</p>
                      <ul>
                        {s.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
