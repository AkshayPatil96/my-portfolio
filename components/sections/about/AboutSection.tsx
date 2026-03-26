import AboutImage from "./AboutImage";
import AboutBio from "./AboutBio";

/**
 * AboutSection — assembles the about sub-components:
 * AboutImage (left column) and AboutBio with embedded SkillBars (right column).
 */
export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-surface-container-lowest overflow-hidden"
    >
      <div className="max-w-[1920px] mx-auto px-8 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-28">
          {/* Left — portrait */}
          <div className="w-full md:w-[40%]">
            <AboutImage />
          </div>

          {/* Right — bio + skills */}
          <AboutBio />
        </div>
      </div>
    </section>
  );
}
