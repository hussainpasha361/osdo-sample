/** First-paint cover: a compass circle draws while a counter runs, then the sheet lifts. */
export default function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      <div className="loader-inner">
        <svg className="loader-mark" viewBox="0 0 120 120">
          <path className="loader-cross" d="M60 6 V114 M6 60 H114" pathLength={1} />
          <circle className="loader-circle" cx="60" cy="60" r="34" pathLength={1} />
        </svg>
        <div className="loader-meta">
          <span>Ovais &amp; Shahzad Design Office</span>
          <span>
            Sheet A-000 · <b data-loader-pct>000</b>
          </span>
        </div>
      </div>
    </div>
  );
}
