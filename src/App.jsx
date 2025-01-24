import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw } from "lucide-react";
import hiraganaMap from "./hiraganaMap";
import katakanaMap from "./katakanaMap";

export default function JapaneseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("hiragana");
  const [copied, setCopied] = useState(false);

  const convertToJapanese = (text, modeMap) => {
    const map = modeMap === "hiragana" ? hiraganaMap : katakanaMap;
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
    setMode(e.target.value);
    setOutput(convertToJapanese(input, e.target.value));
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-red-300 to-yellow-300 text-gray-800 p-4 overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/30 relative overflow-hidden">
          
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-pink-200 rounded-full filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-green-200 rounded-full filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

          <h1 className="text-6xl font-bold mb-6 text-center text-gray-800 drop-shadow-lg">
            SakuraScript Converter
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversion Mode
              </label>
              <select
                value={mode}
                onChange={handleModeChange}
                className="w-full p-3 bg-white/20 border border-pink-500 rounded-xl text-gray-800 focus:ring-3 focus:ring-gray-300 transition"
              >
                <option value="hiragana" className="bg-white-200">Hiragana ひらがな</option>
                <option value="katakana" className="bg-white-200">Katakana カタカナ</option>
              </select>
            </div>

            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type romaji (e.g., 'konnichiwa')"
              className="w-full p-4 bg-white/20 border border-pink-500 rounded-xl text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-pink-300 transition"
            />

            <AnimatePresence>
              {output && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative"
                >
                  <div className="p-4 bg-white/20 border border-pink-500 rounded-xl text-3xl font-bold text-center text-pink-600">
                    {output}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
                  >
                    {copied ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-400"
                      >
                        ✓
                      </motion.div>
                    ) : (
                      <Copy className="text-gray-800 w-5 h-5" />
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                className="flex-1 p-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition"
              >
                <RefreshCw className="inline-block mr-2" /> Clear
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
