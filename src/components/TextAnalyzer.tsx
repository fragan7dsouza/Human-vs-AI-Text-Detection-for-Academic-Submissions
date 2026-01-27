import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AnalysisResult {
  verdict: "Human" | "AI";
  confidence: number;
}

// Simulated ML analysis - replace with real API call when backend is connected
const simulateAnalysis = async (text: string): Promise<AnalysisResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Simple heuristic simulation for demo purposes
  const wordCount = text.split(/\s+/).length;
  const avgWordLength = text.replace(/\s+/g, "").length / wordCount;
  const hasComplexPunctuation = /[;:]/.test(text);
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
  const avgSentenceLength = wordCount / Math.max(sentenceCount, 1);
  
  // Simulate features that might indicate AI text
  let aiScore = 0.5;
  if (avgWordLength > 5.5) aiScore += 0.1;
  if (avgSentenceLength > 20) aiScore += 0.15;
  if (!hasComplexPunctuation && wordCount > 50) aiScore += 0.1;
  if (text.includes("Furthermore") || text.includes("Moreover")) aiScore += 0.1;
  
  // Add some randomness for demo
  aiScore += (Math.random() - 0.5) * 0.2;
  aiScore = Math.max(0.1, Math.min(0.95, aiScore));
  
  const isAI = aiScore > 0.5;
  const confidence = isAI ? aiScore : 1 - aiScore;
  
  return {
    verdict: isAI ? "AI" : "Human",
    confidence: Math.round(confidence * 1000) / 10,
  };
};

export function TextAnalyzer() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please enter text to analyze.");
      setResult(null);
      return;
    }

    if (text.trim().split(/\s+/).length < 10) {
      setError("Please enter at least 10 words for accurate analysis.");
      setResult(null);
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await simulateAnalysis(text);
      setResult(analysisResult);
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6 md:p-8">
        {/* Input Area */}
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(null);
            }}
            placeholder="Paste the text you want to analyze here…"
            className="w-full h-48 md:h-56 bg-input border border-border rounded-md p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring transition-colors text-sm md:text-base"
          />

          {/* Error Message */}
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              "Analyze Text"
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 pt-6 border-t border-border space-y-4">
            {/* Verdict */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">Verdict</span>
              <span
                className={`font-semibold ${
                  result.verdict === "Human"
                    ? "text-success"
                    : "text-destructive"
                }`}
              >
                Likely {result.verdict === "Human" ? "Human-Written" : "AI-Generated"}
              </span>
            </div>

            {/* Confidence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">Confidence</span>
                <span className="font-semibold text-foreground">{result.confidence}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    result.verdict === "Human" ? "bg-success" : "bg-destructive"
                  }`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
