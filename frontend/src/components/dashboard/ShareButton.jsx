import { useState } from "react";
import { createPortal } from "react-dom";
import {
  FiShare2,
  FiDownload,
  FiTwitter,
  FiLinkedin,
  FiLink,
  FiX,
} from "react-icons/fi";

export default function ShareButton({ username }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const shareUrl = window.location.href;
  const shareText = `Check out my GitHub Wrapped 2025! 🚀 #GitHubWrapped`;

  // Export dashboard as image
  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      // Dynamically import modern-screenshot
      const { domToPng } = await import("modern-screenshot");

      const dashboardElement = document.querySelector(".dashboard-container");
      if (!dashboardElement) {
        console.error("Dashboard element not found");
        return;
      }

      const dataUrl = await domToPng(dashboardElement, {
        scale: 2,
        backgroundColor: "#050718",
        quality: 1,
      });

      // Download the image
      const link = document.createElement("a");
      link.download = `github-wrapped-${username}-2025.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error exporting image:", error);
      alert("Failed to export image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  // Share to Twitter
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  // Share to LinkedIn
  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(linkedInUrl, "_blank", "width=550,height=420");
  };

  const modalContent = isOpen ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "28rem",
          padding: "1.5rem",
          borderRadius: "1rem",
          background:
            "linear-gradient(to bottom right, rgb(17, 24, 39), rgb(31, 41, 55))",
          border: "1px solid rgba(168, 85, 247, 0.2)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <FiShare2
              style={{ fontSize: "1.5rem", color: "rgb(168, 85, 247)" }}
            />
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Share Your Wrapped
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(255, 255, 255, 0.7)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Share Options */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {/* Download Image */}
          <button
            onClick={handleExportImage}
            disabled={isExporting}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
              <FiDownload className="text-white text-xl" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold">
                {isExporting ? "Exporting..." : "Download as Image"}
              </p>
              <p className="text-white/60 text-sm">Save as PNG format</p>
            </div>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
              <FiLink className="text-white text-xl" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold">
                {copied ? "Link Copied!" : "Copy Link"}
              </p>
              <p className="text-white/60 text-sm">Copy to clipboard</p>
            </div>
          </button>

          {/* Twitter */}
          <button
            onClick={handleTwitterShare}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600">
              <FiTwitter className="text-white text-xl" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold">Share on Twitter</p>
              <p className="text-white/60 text-sm">Share via X (Twitter)</p>
            </div>
          </button>

          {/* LinkedIn */}
          <button
            onClick={handleLinkedInShare}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-700 to-blue-800">
              <FiLinkedin className="text-white text-xl" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold">Share on LinkedIn</p>
              <p className="text-white/60 text-sm">Share with your network</p>
            </div>
          </button>
        </div>

        {/* Info Text */}
        <p className="mt-6 text-center text-white/50 text-sm">
          Share your GitHub Wrapped 2025 experience! 🚀
        </p>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          group flex items-center gap-2 px-4 py-2 rounded-xl 
          bg-white/5 hover:bg-white/10 
          border border-white/10 hover:border-purple-400/30
          text-white text-sm font-medium
          shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]
          transition-all duration-300 backdrop-blur-sm
        "
      >
        <FiShare2 className="text-lg" />
        Share
      </button>

      {/* Render modal to body */}
      {typeof document !== "undefined" &&
        createPortal(modalContent, document.body)}
    </>
  );
}
