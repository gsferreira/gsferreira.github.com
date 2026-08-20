// The workshop calendar.
//
// Black Lab Studios owns the workshops themselves: descriptions, curriculum,
// formats and booking all live at blacklabstudios.com/workshops. This site
// owns one thing they do not, which is where to catch Gui running them in
// public. That split is why this is a data file and not a set of pages.
//
// `sessions[].registrationUrl` points at the conference, not at Black Lab
// Studios. A public session is sold by whoever runs the event. The Black Lab
// link is for teams who want the workshop run privately.

export default [
  {
    title: "Build Your First AI Agent in .NET",
    format: "2-Day Intensive",
    blurb:
      "Build a working agent in .NET, with tool calling, memory and the agent loop.",
    blsUrl:
      "https://blacklabstudios.com/workshops/build-your-first-ai-agent-in-dotnet/",
    sessions: [
      {
        date: "September 14-15, 2026",
        location: "Oslo, Norway",
        venue: "NDC Oslo",
        spotsLeft: "Seats available",
        available: true,
        registrationUrl:
          "https://ndcoslo.com/agenda/build-your-first-ai-agent-in-net/3c1768c8344e",
      },
      {
        date: "November 17-18, 2026",
        location: "Porto, Portugal",
        venue: "NDC Porto",
        spotsLeft: "Seats available",
        available: true,
        registrationUrl:
          "https://ndcporto.com/agenda/build-your-first-ai-agent-in-net/81f59dbbf411",
      },
      {
        date: "January 25-26, 2027",
        location: "London, United Kingdom",
        venue: "NDC London",
        spotsLeft: "Seats available",
        available: true,
        registrationUrl:
          "https://ndclondon.com/workshops/build-your-first-ai-agent-in-net/78960409ea5f",
      },
    ],
  },
  {
    title: "Designing Tests That Survive Refactorings",
    format: "Half-Day Workshop",
    blurb:
      "Design tests that hold still while the code underneath them moves.",
    blsUrl:
      "https://blacklabstudios.com/workshops/designing-tests-that-survive-refactorings/",
    sessions: [],
  },
  {
    title: "Mastering Test-Driven Development in C#",
    format: "2-Day Intensive",
    blurb:
      "Red, green, refactor, applied to real dependencies and real legacy code.",
    blsUrl: "https://blacklabstudios.com/workshops/mastering-tdd-in-csharp/",
    sessions: [],
  },
];
