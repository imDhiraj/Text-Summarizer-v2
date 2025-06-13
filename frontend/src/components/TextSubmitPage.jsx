import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Loader2,
  Send,
  Trash2,
  AlertCircle,
  ChevronDown,
  FileText,
  List,
  Zap,
  Copy,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import { axiosInstance } from "../lib/axios";

export default function TextSubmitPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summaryStyle, setSummaryStyle] = useState("concise");
  const [maxSentences, setMaxSentences] = useState(2);
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [showSentenceOptions, setShowSentenceOptions] = useState(false);
  const [currentSummaryInfo, setCurrentSummaryInfo] = useState(null);
  const [styleDropdownDirection, setStyleDropdownDirection] = useState("down");
  const [sentenceDropdownDirection, setSentenceDropdownDirection] = useState("down");

  const styleButtonRef = useRef(null);
  const sentenceButtonRef = useRef(null);

  // Function to calculate dropdown direction
  const calculateDropdownDirection = (buttonRef, dropdownHeight = 200) => {
    if (!buttonRef.current) return "down";

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // If there's not enough space below but enough above, open upward
    return spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
      ? "up"
      : "down";
  };

  // Function to get sentence options based on summary style
  const getSentenceOptions = (style) => {
    switch (style) {
      case "concise":
        return [2, 3, 4];
      case "detailed":
        return [5, 7, 10, 12]; // Increased options for detailed
      case "bullet_points":
        return [3, 5, 7, 10];
      default:
        return [2, 3, 4, 5];
    }
  };

  // Function to get default sentence count for each style
  const getDefaultSentenceCount = (style) => {
    switch (style) {
      case "concise":
        return 3;
      case "detailed":
        return 7; // Higher default for detailed
      case "bullet_points":
        return 5;
      default:
        return 3;
    }
  };

  const validateInput = (text) => {
    if (!text.trim()) {
      toast.error("Please enter some text before submitting.");
      return false;
    }

    if (text.trim().length < 50) {
      toast.error(
        "Please enter at least 50 characters for a meaningful summary."
      );
      return false;
    }

    if (text.trim().length > 5000) {
      toast.error("Please limit your text to 5000 characters or less.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput(inputText)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/summarize", {
        text: inputText,
        max_sentences: maxSentences,
        style: summaryStyle,
        preferences: {
          tone: "neutral",
          focus: "main_points",
          audience: "general",
        },
      });

      setOutputText(response.data.summary || "No summary available.");
      setCurrentSummaryInfo({
        style: summaryStyle,
        maxSentences: maxSentences,
        characterCount: inputText.length,
        processingTime: response.data.processing_time || 0,
        outputLength: response.data.summary?.length || 0,
      });

      toast.success(
        `${
          summaryStyle.charAt(0).toUpperCase() +
          summaryStyle.slice(1).replace("_", " ")
        } summary generated successfully!`
      );
    } catch (error) {
      console.error("Backend call failed:", error);

      let errorMessage = "An unexpected error occurred.";

      if (error.response) {
        errorMessage =
          error.response.data.detail ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage =
          "Cannot connect to server. Make sure backend is running on port 8080.";
      } else {
        errorMessage = error.message;
      }

      setOutputText(`Error: ${errorMessage}`);
      setCurrentSummaryInfo(null);

      toast.error(`Processing Failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);

    if (newText.length > 5000) {
      toast.warning(
        `Character limit exceeded! You've entered ${newText.length} characters. Please limit to 5000.`
      );
    }
  };

  // Updated handler for style change - automatically adjust sentence count
  const handleStyleChange = (newStyle) => {
    setSummaryStyle(newStyle);

    // Get the available options for the new style
    const availableOptions = getSentenceOptions(newStyle);
    const defaultCount = getDefaultSentenceCount(newStyle);

    // If current maxSentences is not available in new style options,
    // set it to the default for that style
    if (!availableOptions.includes(maxSentences)) {
      setMaxSentences(defaultCount);
    }

    setShowStyleOptions(false);
  };

  const clearAll = () => {
    setInputText("");
    setOutputText("");
    setCurrentSummaryInfo(null);
    toast.info("All text has been cleared.");
  };

  const characterCount = inputText.length;
  const isValidLength = characterCount >= 50 && characterCount <= 5000;

  const getSummaryIcon = (style) => {
    switch (style) {
      case "concise":
        return <Zap className="h-4 w-4" />;
      case "detailed":
        return <FileText className="h-4 w-4" />;
      case "bullet_points":
        return <List className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getSummaryBorderColor = (style) => {
    switch (style) {
      case "concise":
        return "border-l-blue-500";
      case "detailed":
        return "border-l-green-500";
      case "bullet_points":
        return "border-l-orange-500";
      default:
        return "border-l-primary";
    }
  };

  const handleClickOutside = () => {
    setShowStyleOptions(false);
    setShowSentenceOptions(false);
  };

  return (
    <div className="min-h-screen bg-background" onClick={handleClickOutside}>
      {/* Header */}
      <div className="text-center py-4 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          AI Text Summarizer
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Choose your summary style and length for optimal results
        </p>
      </div>

      {/* Main Content Container - Full Height */}
      <div className="h-[calc(100vh-120px)] px-2 sm:px-4 pb-4">
        <div className="h-full grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-6 max-w-[1600px] mx-auto">
          {/* Input Card - Full Height */}
          <Card className="shadow-lg border-border flex flex-col h-full">
            <CardHeader className="pb-3 sm:pb-4 flex-shrink-0">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                Input Text
                {!isValidLength && characterCount > 0 && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col space-y-3 sm:space-y-4 min-h-0">
              {/* Character Count */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 flex-shrink-0">
                <Label
                  htmlFor="textInput"
                  className="text-sm sm:text-base font-semibold"
                >
                  Enter your text:
                </Label>
                <span
                  className={`text-xs sm:text-sm ${
                    characterCount < 50
                      ? "text-destructive"
                      : characterCount > 5000
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {characterCount}/5000 characters
                  {characterCount < 50 && characterCount > 0 && (
                    <span className="block sm:inline sm:ml-2 text-destructive">
                      (Min 50 required)
                    </span>
                  )}
                </span>
              </div>

              {/* Textarea - Flexible Height */}
              <div className="flex-1 min-h-[200px]">
                <Textarea
                  id="textInput"
                  value={inputText}
                  onChange={handleTextChange}
                  placeholder="Paste or type your text here... (minimum 50 characters for meaningful summarization)"
                  className={`h-full resize-none text-sm sm:text-base ${
                    !isValidLength && characterCount > 0
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  disabled={isLoading}
                  maxLength={5500}
                />
              </div>

              {/* Controls - Fixed at Bottom */}
              <div className="space-y-3 sm:space-y-4 flex-shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Summary Style */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      {getSummaryIcon(summaryStyle)}
                      Summary Style
                    </Label>
                    <div className="relative">
                      <Button
                        ref={styleButtonRef}
                        type="button"
                        variant="outline"
                        className="w-full justify-between text-sm h-11 sm:h-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          const direction = calculateDropdownDirection(
                            styleButtonRef,
                            250
                          );
                          setStyleDropdownDirection(direction);
                          setShowStyleOptions(!showStyleOptions);
                          setShowSentenceOptions(false);
                        }}
                      >
                        <span className="truncate">
                          {summaryStyle.charAt(0).toUpperCase() +
                            summaryStyle.slice(1).replace("_", " ")}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>

                      {showStyleOptions && (
                        <div
                          className={`absolute z-50 w-full ${
                            styleDropdownDirection === "up"
                              ? "bottom-full mb-1"
                              : "top-full mt-1"
                          } bg-background border border-border rounded-md shadow-lg`}
                        >
                          <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                            {[
                              {
                                value: "concise",
                                label: "Concise",
                                desc: "Brief & focused (2-4 sentences)",
                              },
                              {
                                value: "detailed",
                                label: "Detailed",
                                desc: "Comprehensive analysis (5-12 sentences)",
                              },
                              {
                                value: "bullet_points",
                                label: "Bullet Points",
                                desc: "Key points listed (3-10 points)",
                              },
                            ].map((style) => (
                              <button
                                key={style.value}
                                className="w-full px-3 py-2 sm:py-3 text-left hover:bg-muted focus:bg-muted focus:outline-none transition-colors duration-150"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStyleChange(style.value);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {getSummaryIcon(style.value)}
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-sm truncate">
                                      {style.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">
                                      {style.desc}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Max Sentences - Updated to use dynamic options */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Max Sentences/Points
                    </Label>
                    <div className="relative">
                      <Button
                        ref={sentenceButtonRef}
                        type="button"
                        variant="outline"
                        className="w-full justify-between text-sm h-11 sm:h-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          const direction = calculateDropdownDirection(
                            sentenceButtonRef,
                            180
                          );
                          setSentenceDropdownDirection(direction);
                          setShowSentenceOptions(!showSentenceOptions);
                          setShowStyleOptions(false);
                        }}
                      >
                        <span className="truncate">
                          {maxSentences}{" "}
                          {summaryStyle === "bullet_points"
                            ? "points"
                            : "sentences"}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>

                      {showSentenceOptions && (
                        <div
                          className={`absolute z-50 w-full ${
                            sentenceDropdownDirection === "up"
                              ? "bottom-full mb-1"
                              : "top-full mt-1"
                          } bg-background border border-border rounded-md shadow-lg`}
                        >
                          <div className="max-h-40 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                            {getSentenceOptions(summaryStyle).map((num) => (
                              <button
                                key={num}
                                className="w-full px-3 py-2 text-left hover:bg-muted focus:bg-muted focus:outline-none text-sm transition-colors duration-150"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMaxSentences(num);
                                  setShowSentenceOptions(false);
                                }}
                              >
                                {num}{" "}
                                {summaryStyle === "bullet_points"
                                  ? "points"
                                  : "sentences"}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !inputText.trim() || !isValidLength}
                    className="flex-1 text-sm font-medium h-12 sm:h-10"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="truncate">Generating summary...</span>
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        <span className="truncate">Generate Summary</span>
                      </>
                    )}
                  </Button>

                  {outputText && (
                    <Button
                      onClick={clearAll}
                      variant="outline"
                      size="lg"
                      className="sm:w-auto text-sm font-medium h-12 sm:h-10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span className="truncate">Clear All</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output Card - Full Height */}
          <Card
            className={`shadow-lg border-l-4 ${getSummaryBorderColor(
              currentSummaryInfo?.style || "concise"
            )} flex flex-col h-full`}
          >
            <CardHeader className="pb-3 sm:pb-4 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  {currentSummaryInfo &&
                    getSummaryIcon(currentSummaryInfo.style)}
                  <span className="truncate">Summary Output</span>
                </CardTitle>
                {currentSummaryInfo && (
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">
                    {currentSummaryInfo.style.replace("_", " ")} •{" "}
                    {currentSummaryInfo.maxSentences}{" "}
                    {currentSummaryInfo.style === "bullet_points"
                      ? "points"
                      : "sentences"}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col min-h-0">
              {outputText ? (
                <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col min-h-0">
                  {currentSummaryInfo && (
                    <div className="p-2 sm:p-3 bg-muted rounded border-l-4 border-l-primary flex-shrink-0">
                      <div className="text-xs sm:text-sm font-medium mb-2">
                        Summary Details:
                      </div>
                      <div className="text-xs text-muted-foreground grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2">
                        <div className="truncate">
                          Style:{" "}
                          <span className="font-medium">
                            {currentSummaryInfo.style.charAt(0).toUpperCase() +
                              currentSummaryInfo.style
                                .slice(1)
                                .replace("_", " ")}
                          </span>
                        </div>
                        <div className="truncate">
                          Length:{" "}
                          <span className="font-medium">
                            {currentSummaryInfo.maxSentences}{" "}
                            {currentSummaryInfo.style === "bullet_points"
                              ? "points"
                              : "sentences"}
                          </span>
                        </div>
                        <div className="truncate">
                          Input:{" "}
                          <span className="font-medium">
                            {currentSummaryInfo.characterCount} chars
                          </span>
                        </div>
                        <div className="truncate">
                          Output:{" "}
                          <span className="font-medium">
                            {currentSummaryInfo.outputLength} chars
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-card p-3 sm:p-5 rounded-lg border flex-1 min-h-0 overflow-hidden relative group prose dark:prose-invert max-w-none h-full overflow-y-auto text-sm sm:text-base leading-relaxed">
                    <ReactMarkdown>{outputText}</ReactMarkdown>
                    {outputText && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => {
                          const el = document.createElement("textarea");
                          el.value = outputText;
                          document.body.appendChild(el);
                          el.select();
                          document.execCommand("copy");
                          document.body.removeChild(el);
                          toast.success("Summary copied to clipboard!");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy summary</span>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-muted/50 p-4 sm:p-8 rounded-lg min-h-[200px] flex-1 flex items-center justify-center">
                  <div className="text-center space-y-3 max-w-sm">
                    <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-muted-foreground font-medium text-sm sm:text-base">
                        Your AI-generated summary will appear here
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Choose your preferred style and length above
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
    </div>
  );
}