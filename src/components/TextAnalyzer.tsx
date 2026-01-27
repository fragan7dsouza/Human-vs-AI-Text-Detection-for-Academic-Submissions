import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AnalysisResult {
  verdict: "Human" | "AI";
  confidence: number;
}

export function TextAnalyzer() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("please enter text to analyze.");
      setResult(null);
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("failed to connect to the ml server. make sure app.py is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6 md:p-8">
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(null);
            }}
            placeholder="paste the text you want to analyze here…"
            className="w-full h-48 md:h-56 bg-input border border-border rounded-md p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring transition-colors text-sm md:text-base"
          />

          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                analyzing…
              </>
            ) : (
              "analyze text"
            )}
          </button>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">verdict</span>
              <span
                className={`font-semibold ${
                  result.verdict === "Human"
                    ? "text-success"
                    : "text-destructive"
                }`}
              >
                likely {result.verdict === "Human" ? "human-written" : "ai-generated"}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">confidence</span>
                <span className="font-semibold text-foreground">{result.confidence}%</span>
              </div>
              
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