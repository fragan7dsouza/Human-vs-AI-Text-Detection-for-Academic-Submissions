import { TextAnalyzer } from "@/components/TextAnalyzer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
        {/* Header Section */}
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Human vs AI Academic Text Detector
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            Classify academic text as human-written or AI-generated using machine learning.
          </p>
        </header>

        {/* Main Tool */}
        <TextAnalyzer />

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-muted-foreground text-xs">
            Results are probabilistic and should be used as one factor among many.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
