export default function Footer() {
  return (
    <footer className="w-full mt-10 py-12 flex flex-col items-center text-center relative">
      {/* Thin neon line at the top */}
      <div className="w-40 h-[1px] bg-gradient-to-r from-purple-400/20 via-purple-500/60 to-purple-400/20 mb-8" />

      {/* Title */}
      <h3 className="text-white/80 text-lg font-semibold mb-2">
        Enjoyed your Wrapped?
      </h3>

      {/* Subtitle */}
      <p className="text-white/40 text-sm mb-6">
        Share it with your friends and on social media!
      </p>

      {/* Year & copyright info */}
      <p className="text-[11px] text-white/25 tracking-wide">
        © {new Date().getFullYear()} GitHub Wrapped •{" "}
        <a
          href="https://github.com/tolgab35"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400/60 hover:text-purple-400 transition-colors duration-200"
        >
          tolgab35
        </a>
      </p>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-10 bg-purple-700/10 blur-2xl pointer-events-none" />
    </footer>
  );
}
