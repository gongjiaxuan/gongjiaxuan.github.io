(() => {
  "use strict";
  const controls = document.querySelector(".evidence-controls");
  if (!controls) return;
  const views = {
    participation: {
      title: "Who gets to shape the work?",
      takeaway:
        "Disabled people are reported as participating in evaluation in 141 papers, compared with 13 at problem definition and 4 at dissemination.",
      caution:
        "Stages are non-exclusive. A paper can appear in several rows. Involvement alone does not show how much influence participants had.",
      rows: [
        ["Problem definition", 13],
        ["Design", 45],
        ["Development / iteration", 27],
        ["Evaluation", 141],
        ["Analysis / interpretation", 22],
        ["Dissemination", 4],
      ],
      source:
        "Source: manuscript participation analysis and Figure 6. All rows use the full corpus denominator.",
      figure: 6,
      caption:
        "Figure 6. Reported participation of disabled people. Stages are non-exclusive.",
    },
    duration: {
      title: "How long do participant studies last?",
      takeaway:
        "125 papers report a single-session participant study. That is 52.1% of the full corpus, or 65.1% of the 192 papers with a separate participant study.",
      caution:
        "Categories are mutually exclusive. Duration is not deployment length or a quality ranking; a longer study does not necessarily mean continuous everyday use.",
      rows: [
        ["Single session", 125],
        ["Repeated, under 1 week", 2],
        ["1 to 4 weeks", 18],
        ["Over 1 month", 19],
        ["Duration not reported", 28],
        ["No separate participant study", 48],
      ],
      source:
        "Source: manuscript duration analysis and Figure 5. Counts sum to 240 papers.",
      figure: 5,
      caption: "Figure 5. Study duration by application or research area.",
    },
    risks: {
      title: "What concerns surface in the papers?",
      takeaway:
        "Reliability and safety are reported in 171 papers. Use and verification burdens appear in 107, making the work of checking outputs part of the accessibility question.",
      caution:
        "Categories overlap and include findings, participant accounts, and explicit study-specific discussion. Counts are not incident rates or measures of severity.",
      rows: [
        ["Reliability / safety", 171],
        ["Accessibility coverage", 133],
        ["Use / verification burdens", 107],
        ["Autonomy / dependence", 77],
        ["Bias / identity / culture", 56],
        ["Privacy / consent / data", 40],
        ["Cost / resources", 35],
        ["Governance / responsibility", 28],
        ["Misuse / integrity", 4],
      ],
      source:
        "Source: manuscript concern analysis and Figure 7. Eleven papers had no coded concern. The 171 reliability/safety papers are a different set from the 171 papers requiring output checking.",
      figure: 7,
      caption:
        "Figure 7. Reported concerns. Non-exclusive categories; not incident rates.",
    },
  };
  const buttons = [...controls.querySelectorAll("button")];
  function selectView(key) {
    const view = views[key];
    if (!view) return;
    for (const field of ["title", "takeaway", "caution", "source"]) {
      document.getElementById(`evidence-${field}`).textContent = view[field];
    }
    const rows = view.rows.map(([label, count]) => {
      const row = document.createElement("div");
      row.className = "review-bar-row";
      const name = document.createElement("span");
      name.textContent = label;
      const track = document.createElement("div");
      track.setAttribute("aria-hidden", "true");
      const bar = document.createElement("i");
      bar.style.width = `${(count / 240) * 100}%`;
      track.append(bar);
      const value = document.createElement("b");
      value.textContent = count;
      row.append(name, track, value);
      return row;
    });
    document.getElementById("evidence-bars").replaceChildren(...rows);
    const figure = document.getElementById("evidence-figure");
    figure.href = `../images/research/genai-accessibility/figure-${view.figure}.webp`;
    figure.dataset.caption = view.caption;
    figure.dataset.alt = `${view.caption} ${view.rows.map(([label, count]) => `${label}: ${count}`).join("; ")}.`;
    buttons.forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.view === key)),
    );
    document.getElementById("evidence-status").textContent =
      `${view.title} ${view.rows.length} categories displayed, with all bars scaled to 240 papers.`;
  }
  buttons.forEach((button) =>
    button.addEventListener("click", () => selectView(button.dataset.view)),
  );
  controls.hidden = false;
})();
