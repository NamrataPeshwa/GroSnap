import { useState, useEffect } from "react";
import IntroGroSnap from "./intro"; 

export default function HomePage() {
  const [showMainContent, setShowMainContent] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Check if intro has already been shown in this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setShowIntro(false);
      setShowMainContent(true);
    }
  }, []);

  const handleIntroFinish = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    setShowIntro(false);
    setShowMainContent(true);
  };

  return (
    <>
      {showIntro ? (
        <IntroGroSnap onFinish={handleIntroFinish} />
      ) : (
        <div className="min-h-screen bg-[#f9fafb] text-[#1a1a1a] overflow-x-hidden">
          <GroSnapLanding />
          <ShopScroller />
          <Features />
          <Reviews />
          <Footer />
        </div>
      )}
    </>
  );
}
