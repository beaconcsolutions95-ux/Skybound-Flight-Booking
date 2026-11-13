import { FormEvent, useMemo, useState } from "react";

// Restrict icon names to the supported SVG symbols.
type IconName =
  | "arrow"
  | "calendar"
  | "check"
  | "chevron"
  | "clock"
  | "mail"
  | "menu"
  | "plane"
  | "search"
  | "swap"
  | "user"
  | "users";

// Reusable decorative SVG icons; aria-hidden avoids redundant screen-reader output.
function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    calendar: (
      <>
        <path d="M6 3v3m12-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    plane: (
      <path d="m3 14 7.5-1.5V7.2c0-1.8.7-4.7 1.5-4.7s1.5 2.9 1.5 4.7v5.3L21 14v2l-7.5-.5V19l2 1v1.5L12 21l-3.5.5V20l2-1v-3.5L3 16v-2Z" />
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    swap: <path d="m7 7-3 3 3 3m-3-3h14m-1 1 3 3-3 3m3-3H6" />,
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21c.5-4 2.8-6 7-6s6.5 2 7 6" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c.4-3.7 2.4-5.5 6-5.5s5.6 1.8 6 5.5M15 5.5a3 3 0 0 1 0 5.5m1.5 2.6c2.7.5 4.2 2.3 4.5 5.4" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

// Fixed airport options for the demonstration, not a live airline database.
const airports = [
  "Sydney (SYD)",
  "Melbourne (MEL)",
  "Brisbane (BNE)",
  "Perth (PER)",
  "Auckland (AKL)",
  "Singapore (SIN)",
  "London (LHR)",
  "Los Angeles (LAX)",
];

// Shared visual label styling for form fields.
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
      {children}
    </span>
  );
}

export default function App() {
  // Calculate the minimum departure date using an ISO date string.
  const today = new Date().toISOString().split("T")[0];
  // Track whether the small-screen navigation menu is open.
  const [mobileNav, setMobileNav] = useState(false);
  // Controlled flight-search inputs and result visibility.
  const [tripType, setTripType] = useState<"return" | "oneway">("return");
  const [from, setFrom] = useState("Sydney (SYD)");
  const [to, setTo] = useState("Melbourne (MEL)");
  const [depart, setDepart] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [flightSearch, setFlightSearch] = useState(false);
  const [flightError, setFlightError] = useState("");
  // Booking lookup inputs and success/error feedback.
  const [bookingRef, setBookingRef] = useState("");
  const [surname, setSurname] = useState("");
  const [bookingResult, setBookingResult] = useState<"success" | "error" | null>(null);
  // Flight-status inputs and simulated result state.
  const [flightNumber, setFlightNumber] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [statusResult, setStatusResult] = useState<"success" | "error" | null>(null);
  // Contact form values, field-specific errors and confirmation state.
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  // Reformat the departure date only when its value changes.
  const formattedDepart = useMemo(
    () =>
      depart
        ? new Date(`${depart}T12:00:00`).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
          })
        : "",
    [depart],
  );

  // Clear stale results and errors whenever a search input changes.
  function resetFlightSearch() {
    setFlightSearch(false);
    setFlightError("");
  }

  // Exchange the selected airports using their current state values.
  function swapRoute() {
    setFrom(to);
    setTo(from);
    resetFlightSearch();
  }

  // Prevent page reload and show a simulated result when required inputs exist.
  // A return date is required only for return trips.
  function searchFlights(e: FormEvent) {
    e.preventDefault();
    resetFlightSearch();
    // Reject identical airports before displaying simulated availability.
    if (from === to) {
      setFlightError("Please select different departure and arrival airports.");
      return;
    }
    if (from && to && depart && (tripType === "oneway" || returnDate)) setFlightSearch(true);
  }

  // Normalise case and whitespace before matching the single demonstration booking.
  // No real booking database is queried.
  function retrieveBooking(e: FormEvent) {
    e.preventDefault();
    setBookingResult(
      bookingRef.trim().toUpperCase() === "SKY123" && surname.trim().toUpperCase() === "HART"
        ? "success"
        : "error",
    );
  }

  // Check that a flight number and date exist; the displayed status is mock data.
  function checkStatus(e: FormEvent) {
    e.preventDefault();
    setStatusResult(flightNumber.trim() && travelDate ? "success" : "error");
  }

  // Validate name length, email format and message length on the client.
  // Store errors for inline feedback; success does not send a real email.
  function submitContact(e: FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (contact.name.trim().length < 2) errors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
      errors.email = "Enter a valid email address.";
    if (contact.message.trim().length < 15)
      errors.message = "Tell us a little more (at least 15 characters).";
    setContactErrors(errors);
    if (!Object.keys(errors).length) setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#f4f5f6] text-[#172234]">
      {/* Desktop navigation and a collapsible menu for smaller screens. */}
      <header className="absolute inset-x-0 top-0 z-30 border-b border-white/20 text-white">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 lg:px-10">
          <a href="#" className="flex items-center gap-3" aria-label="Skybound home">
            <span className="grid size-10 place-items-center rounded-full bg-[#e1262e]">
              <Icon name="plane" className="size-6 rotate-45" />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">Skybound</span>
          </a>
          <nav className="hidden items-center gap-9 text-sm font-medium lg:flex">
            <a className="nav-link" href="#book">
              Book
            </a>
            <a className="nav-link" href="#manage">
              Manage booking
            </a>
            <a className="nav-link" href="#status">
              Flight status
            </a>
            <a className="nav-link" href="#contact">
              Help
            </a>
          </nav>
          <div className="hidden items-center gap-5 lg:flex">
            <button className="flex items-center gap-2 text-sm font-medium">
              <Icon name="search" /> Search
            </button>
            <span className="h-5 w-px bg-white/30" />
            <button className="flex items-center gap-2 text-sm font-medium">
              <Icon name="user" /> Sign in
            </button>
          </div>
          <button
            className="grid size-10 place-items-center rounded-full border border-white/40 lg:hidden"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle menu"
          >
            <Icon name="menu" />
          </button>
        </div>
        {/* Render mobile links only while the menu is open. */}
        {mobileNav && (
          <nav className="mx-4 rounded-xl bg-white p-4 text-sm font-semibold text-slate-800 shadow-xl lg:hidden">
            {["Book", "Manage booking", "Flight status", "Help"].map((item, index) => (
              <a
                key={item}
                className="block border-b border-slate-100 px-3 py-3 last:border-0"
                href={["#book", "#manage", "#status", "#contact"][index]}
                onClick={() => setMobileNav(false)}
              >
                {item}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Main travel tasks are arranged as sections of a single page. */}
      <main>
        <section className="relative min-h-[660px] overflow-hidden bg-[#172234] pb-36 pt-36 text-white lg:min-h-[710px] lg:pb-48 lg:pt-40">
          <img
            src="/skybound-hero.png"
            alt="Airplane wing above clouds at sunrise"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,18,32,.82)_0%,rgba(9,18,32,.38)_48%,rgba(9,18,32,.08)_100%)]" />
          <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="max-w-2xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-white/75">
                Make the world feel closer
              </p>
              <h1 className="font-display text-5xl leading-[.98] tracking-[-0.04em] sm:text-6xl lg:text-[78px]">
                Your next chapter
                <br />
                starts in the sky.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/80 lg:text-lg">
                Thoughtful journeys, warm Australian hospitality and more ways to explore the places
                you love.
              </p>
            </div>
          </div>
        </section>

        <section
          id="book"
          className="relative z-10 mx-auto -mt-28 max-w-[1320px] scroll-mt-8 px-4 lg:-mt-36 lg:px-6"
        >
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_25px_70px_rgba(23,34,52,.18)]">
            <div className="flex border-b border-slate-200 px-5 lg:px-8">
              <button className="relative flex items-center gap-2 px-2 py-5 text-sm font-bold text-[#d91f2c] after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-[#d91f2c]">
                <Icon name="plane" /> Book a flight
              </button>
              <a href="#manage" className="ml-8 px-2 py-5 text-sm font-semibold text-slate-500">
                Manage booking
              </a>
              <a
                href="#status"
                className="ml-8 hidden px-2 py-5 text-sm font-semibold text-slate-500 sm:block"
              >
                Flight status
              </a>
            </div>
            <form className="p-5 lg:p-8" onSubmit={searchFlights}>
              <div className="mb-6 flex gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input
                    type="radio"
                    checked={tripType === "return"}
                    onChange={() => { setTripType("return"); resetFlightSearch(); }}
                    className="accent-[#d91f2c]"
                  />{" "}
                  Return
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input
                    type="radio"
                    checked={tripType === "oneway"}
                    onChange={() => { setTripType("oneway"); resetFlightSearch(); }}
                    className="accent-[#d91f2c]"
                  />{" "}
                  One way
                </label>
              </div>
              <div className="grid gap-3 lg:grid-cols-[1.35fr_48px_1.35fr_1fr_1fr_.8fr_1.1fr] lg:items-end">
                <label className="form-field">
                  <FieldLabel>From</FieldLabel>
                  <span className="field-control">
                    <Icon name="plane" className="size-5 text-slate-400" />
                    <select value={from} onChange={(e) => { setFrom(e.target.value); resetFlightSearch(); }}>
                      {airports.map((airport) => (
                        <option key={airport}>{airport}</option>
                      ))}
                    </select>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={swapRoute}
                  className="mx-auto mb-1 grid size-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-red-300 hover:text-[#d91f2c]"
                  aria-label="Swap origin and destination"
                >
                  <Icon name="swap" />
                </button>
                <label className="form-field">
                  <FieldLabel>To</FieldLabel>
                  <span className="field-control">
                    <Icon name="plane" className="size-5 rotate-90 text-slate-400" />
                    <select value={to} onChange={(e) => { setTo(e.target.value); resetFlightSearch(); }}>
                      {airports.map((airport) => (
                        <option key={airport}>{airport}</option>
                      ))}
                    </select>
                  </span>
                </label>
                <label className="form-field">
                  <FieldLabel>Depart</FieldLabel>
                  <span className="field-control">
                    <Icon name="calendar" className="size-5 text-slate-400" />
                    <input
                      type="date"
                      min={today}
                      value={depart}
                      onChange={(e) => {
                        setDepart(e.target.value);
                        resetFlightSearch();
                      }}
                      required
                    />
                  </span>
                </label>
                <label className={`form-field ${tripType === "oneway" ? "opacity-40" : ""}`}>
                  <FieldLabel>Return</FieldLabel>
                  <span className="field-control">
                    <Icon name="calendar" className="size-5 text-slate-400" />
                    <input
                      type="date"
                      min={depart || today}
                      value={returnDate}
                      onChange={(e) => { setReturnDate(e.target.value); resetFlightSearch(); }}
                      required={tripType === "return"}
                      disabled={tripType === "oneway"}
                    />
                  </span>
                </label>
                <label className="form-field">
                  <FieldLabel>Passengers</FieldLabel>
                  <span className="field-control">
                    <Icon name="users" className="size-5 text-slate-400" />
                    <select value={passengers} onChange={(e) => { setPassengers(e.target.value); resetFlightSearch(); }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "adult" : "people"}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
                <button className="h-[52px] rounded-lg bg-[#d91f2c] px-5 text-sm font-bold text-white transition hover:bg-[#bd1723]">
                  Search flights
                </button>
              </div>
              {/* Announce route validation feedback to assistive technologies. */}
              {flightError && (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
                  {flightError}
                </p>
              )}
              {flightSearch && (
                <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl bg-[#f4f7fa] p-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <span className="grid size-11 place-items-center rounded-full bg-white text-[#d91f2c] shadow-sm">
                      <Icon name="plane" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {formattedDepart} · {passengers}{" "}
                        {passengers === "1" ? "traveller" : "travellers"}
                      </p>
                      <p className="mt-1 font-bold">
                        {from} <span className="mx-2 text-slate-300">—</span> {to}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-700">
                    12 available flights found (demo)
                  </p>
                </div>
              )}
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-24 lg:py-32">
          <div className="mb-12 text-center">
            <p className="eyebrow">Your journey, made simple</p>
            <h2 className="section-title">Everything you need, all in one place.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <article id="manage" className="service-card scroll-mt-24">
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <p className="eyebrow">Upcoming travel</p>
                  <h3 className="card-title">Manage booking</h3>
                </div>
                <span className="icon-badge">
                  <Icon name="user" />
                </span>
              </div>
              <p className="mb-7 max-w-md text-sm leading-6 text-slate-500">
                View your itinerary, choose seats or make a change. Try <b>SKY123</b> and surname{" "}
                <b>HART</b>.
              </p>
              <form onSubmit={retrieveBooking} className="space-y-4">
                <label className="form-field">
                  <FieldLabel>Booking reference</FieldLabel>
                  <span className="field-control">
                    <input
                      placeholder="e.g. SKY123"
                      value={bookingRef}
                      onChange={(e) => {
                        setBookingRef(e.target.value);
                        setBookingResult(null);
                      }}
                      required
                    />
                  </span>
                </label>
                <label className="form-field">
                  <FieldLabel>Passenger surname</FieldLabel>
                  <span className="field-control">
                    <input
                      placeholder="As shown on your booking"
                      value={surname}
                      onChange={(e) => {
                        setSurname(e.target.value);
                        setBookingResult(null);
                      }}
                      required
                    />
                  </span>
                </label>
                <button className="secondary-button">
                  Retrieve booking <Icon name="arrow" />
                </button>
              </form>
              {bookingResult === "error" && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
                  We couldn’t find that booking. Check the reference and surname, then try again.
                </p>
              )}
              {bookingResult === "success" && (
                <div className="result-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Booking confirmed
                      </p>
                      <p className="mt-1 font-bold">Sydney to Melbourne</p>
                    </div>
                    <span className="status-pill">Confirmed</span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-200 pt-4 text-sm">
                    <div>
                      <span className="result-label">Flight</span>
                      <b>SY 218</b>
                    </div>
                    <div>
                      <span className="result-label">Date</span>
                      <b>18 Oct</b>
                    </div>
                    <div>
                      <span className="result-label">Passenger</span>
                      <b>Alex Hart</b>
                    </div>
                  </div>
                </div>
              )}
            </article>

            <article id="status" className="service-card scroll-mt-24">
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <p className="eyebrow">Live updates</p>
                  <h3 className="card-title">Flight status</h3>
                </div>
                <span className="icon-badge">
                  <Icon name="clock" />
                </span>
              </div>
              <p className="mb-7 max-w-md text-sm leading-6 text-slate-500">
                Check the latest departure and arrival information for your Skybound flight.
              </p>
              <form onSubmit={checkStatus} className="space-y-4">
                <label className="form-field">
                  <FieldLabel>Flight number</FieldLabel>
                  <span className="field-control">
                    <input
                      placeholder="e.g. SY218"
                      value={flightNumber}
                      onChange={(e) => {
                        setFlightNumber(e.target.value);
                        setStatusResult(null);
                      }}
                    />
                  </span>
                </label>
                <label className="form-field">
                  <FieldLabel>Travel date</FieldLabel>
                  <span className="field-control">
                    <Icon name="calendar" className="size-5 text-slate-400" />
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => {
                        setTravelDate(e.target.value);
                        setStatusResult(null);
                      }}
                    />
                  </span>
                </label>
                <button className="secondary-button">
                  Check flight status <Icon name="arrow" />
                </button>
              </form>
              {statusResult === "error" && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
                  Enter a flight number and travel date to continue.
                </p>
              )}
              {statusResult === "success" && (
                <div className="result-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {flightNumber.toUpperCase()}
                      </p>
                      <p className="mt-1 font-bold">
                        Sydney <span className="mx-2 text-slate-300">→</span> Melbourne
                      </p>
                    </div>
                    <span className="status-pill">
                      <span className="size-1.5 rounded-full bg-emerald-600" /> On time
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-200 pt-4 text-sm">
                    <div>
                      <span className="result-label">Departure</span>
                      <b>09:35</b>
                    </div>
                    <div>
                      <span className="result-label">Gate</span>
                      <b>12</b>
                    </div>
                    <div>
                      <span className="result-label">Arrival</span>
                      <b>11:10</b>
                    </div>
                  </div>
                </div>
              )}
            </article>
          </div>
        </section>

        <section id="contact" className="bg-[#172234] px-5 py-24 text-white lg:py-28">
          <div className="mx-auto grid max-w-[1200px] gap-16 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#ff777d]">
                We’re here to help
              </p>
              <h2 className="font-display text-4xl leading-tight tracking-tight lg:text-5xl">
                Tell us how we can help.
              </h2>
              <p className="mt-6 max-w-sm leading-7 text-white/60">
                Our Australian support team is available every day. Send us a note and we’ll be in
                touch shortly.
              </p>
              <div className="mt-10 flex items-center gap-4 text-sm text-white/80">
                <span className="grid size-11 place-items-center rounded-full bg-white/10">
                  <Icon name="mail" />
                </span>
                <div>
                  <p className="text-xs text-white/45">Email support</p>
                  <p className="font-semibold">hello@skybound.com.au</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 text-[#172234] shadow-2xl lg:p-9">
              {sent ? (
                <div className="grid min-h-[390px] place-items-center text-center">
                  <div>
                    <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                      <Icon name="check" className="size-8" />
                    </span>
                    <h3 className="card-title mt-6">Message received</h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                      Thanks, {contact.name}. Your enquiry passed validation in this prototype.
                      No actual email has been sent.
                    </p>
                    <button
                      onClick={() => {
                        setSent(false);
                        setContact({ name: "", email: "", message: "" });
                      }}
                      className="mt-6 text-sm font-bold text-[#d91f2c]"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submitContact} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="form-field">
                      <FieldLabel>Customer name</FieldLabel>
                      <span className={`field-control ${contactErrors.name ? "field-error" : ""}`}>
                        <input
                          placeholder="Your full name"
                          value={contact.name}
                          onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        />
                      </span>
                      {contactErrors.name && (
                        <span className="error-message">{contactErrors.name}</span>
                      )}
                    </label>
                    <label className="form-field">
                      <FieldLabel>Email address</FieldLabel>
                      <span className={`field-control ${contactErrors.email ? "field-error" : ""}`}>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={contact.email}
                          onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        />
                      </span>
                      {contactErrors.email && (
                        <span className="error-message">{contactErrors.email}</span>
                      )}
                    </label>
                  </div>
                  <label className="form-field mt-5">
                    <FieldLabel>Enquiry message</FieldLabel>
                    <span className={`field-control ${contactErrors.message ? "field-error" : ""}`}>
                      <textarea
                        rows={6}
                        placeholder="How can we help with your journey?"
                        value={contact.message}
                        onChange={(e) => setContact({ ...contact, message: e.target.value })}
                      />
                    </span>
                    {contactErrors.message && (
                      <span className="error-message">{contactErrors.message}</span>
                    )}
                  </label>
                  <div className="mt-6 flex flex-col-reverse items-start justify-between gap-5 sm:flex-row sm:items-center">
                    <p className="max-w-xs text-xs leading-5 text-slate-400">
                      By submitting, you agree to our privacy policy and terms of use.
                    </p>
                    <button className="h-12 rounded-lg bg-[#d91f2c] px-7 text-sm font-bold text-white transition hover:bg-[#bd1723]">
                      Send enquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#172234] text-white/60">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-5 py-8 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex items-center gap-2 text-white">
            <span className="grid size-7 place-items-center rounded-full bg-[#d91f2c]">
              <Icon name="plane" className="size-4 rotate-45" />
            </span>
            <span className="font-display text-lg font-semibold">Skybound</span>
          </div>
          <p>© 2025 Skybound Airways. Prototype experience.</p>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
