import React, { useState, useEffect } from "react";
import { Copy, RefreshCw, Check, Moon, Sun } from "lucide-react";
import hiraganaMap from "./hiraganaMap";
import hiraganaPhrases from "./hiraganaPhrases";
import katakanaMap from "./katakanaMap";

export default function JapaneseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("hiragana");
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [theme, setTheme] = useState("light");

  const convertToJapanese = (text, modeMap) => {
    const map = modeMap === "hiragana" ? hiraganaMap : katakanaMap;
    const phrases = modeMap === "hiragana" ? hiraganaPhrases : {};

    // Check for multi-word mappings first
    Object.keys(phrases).forEach(key => {
      if (text.includes(key)) {
        text = text.replace(new RegExp(key, 'g'), phrases[key]);
      }
    });

    let result = "";
    let i = 0;

    while (i < text.length) {
      let found = false;
      for (let length = 3; length > 0; length--) {
        const slice = text.slice(i, i + length).toLowerCase();
        if (map[slice]) {
          result += map[slice];
          i += length;
          found = true;
          break;
        }
      }
      if (!found) {
        result += text[i];
        i++;
      }
    }

    return result;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setOutput(convertToJapanese(value, mode));
  };

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setMode(newMode);
    setOutput(convertToJapanese(input, newMode));
    setIsAnimating(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setIsAnimating(true);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-pink-100 via-white to-blue-100"
          : "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-lg p-6 relative overflow-hidden transition-colors duration-300 ${
          theme === "light"
            ? "bg-white border border-gray-200"
            : "bg-gray-800 border border-gray-700"
        }`}
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 dark:bg-pink-800 rounded-full filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>

        <h1
          className={`text-4xl font-bold mb-6 text-center relative z-10 transition-colors duration-300 ${
            theme === "light" ? "text-gray-800" : "text-white"
          }`}
        >
          SakuraScript Converter
        </h1>

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-center">
            <select
              value={mode}
              onChange={handleModeChange}
              className={`w-3/4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                isAnimating ? "animate-wiggle" : ""
              } ${
                theme === "light"
                  ? "bg-white text-gray-700 border-gray-300"
                  : "bg-gray-700 text-white border-gray-600"
              }`}
            >
              <option value="hiragana">Hiragana ひらがな</option>
              <option value="katakana">Katakana カタカナ</option>
            </select>
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-colors duration-300 ${
                theme === "light"
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {theme === "light" ? (
                <Moon className="w-6 h-6" />
              ) : (
                <Sun className="w-6 h-6" />
              )}
            </button>
          </div>

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type romaji (e.g., 'konnichiwa')"
            className={`w-full p-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              theme === "light"
                ? "bg-white text-gray-700 border-gray-300"
                : "bg-gray-700 text-white border-gray-600"
            }`}
          />

          {output && (
            <div
              className={`relative p-4 border rounded-xl text-2xl text-center transition-all ${
                isAnimating ? "animate-wiggle" : ""
              } ${
                theme === "light"
                  ? "bg-gray-100 text-gray-800 border-gray-300"
                  : "bg-gray-900 text-white border-gray-700"
              }`}
            >
              {output}
              <button
                onClick={handleCopy}
                className={`absolute top-2 right-2 p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === "light"
                    ? "bg-white hover:bg-gray-200"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {copied ? (
                  <Check
                    className={`w-5 h-5 ${
                      theme === "light" ? "text-green-500" : "text-green-400"
                    }`}
                  />
                ) : (
                  <Copy
                    className={`w-5 h-5 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                )}
              </button>
            </div>
          )}

          <button
            onClick={handleClear}
            className={`w-full p-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-700 flex items-center justify-center ${
              theme === "light"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <RefreshCw className="mr-2 w-5 h-5" /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}