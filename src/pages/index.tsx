/* eslint-disable react/no-unescaped-entities */
import { useState, useRef } from "react";
import GithubLogo from "@/components/GithubLogo";

type Prompt = {
  prompt: string;
  parentheses: number;
};

function processInput(input: string): string {
  function parseString(input: string): Prompt[] {
    const regex = /\(((?:[^:]|\:(?!\d))+)\:*(\d+\.\d+)*\)/g;
    const prompts = input.split(",").map((s) => s.trim());
    const result: Prompt[] = [];

    for (const prompt of prompts) {
      const matches = Array.from(prompt.matchAll(regex));
      let parentheses = 0;
      let cleanedPrompt = prompt;

      if (matches.length > 0) {
        const match = matches[0];
        cleanedPrompt = match[1].trim();
        parentheses = match[2] ? parseInt(match[2].split(".")[1], 10) : 0;
      } else {
        cleanedPrompt = prompt;
        parentheses = 0;
      }

      if (cleanedPrompt.length > 0) {
        result.push({ prompt: cleanedPrompt, parentheses: parentheses });
      }
    }

    return result;
  }

  function objectsToString(arr: Prompt[]): string {
    return arr
      .map(({ prompt, parentheses }) => {
        let result = prompt;
        for (let i = 0; i < parentheses; i++) {
          result = `(${result})`;
        }
        return result;
      })
      .join(", ");
  }

  const parsedArray = parseString(input);
  const outputString = objectsToString(parsedArray);
  return outputString;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [copyButtonDisabled, setCopyButtonDisabled] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    const processedOutput = processInput(input);
    setOutput(processedOutput);
  };

  const handleCopy = async () => {
    if (outputRef.current) {
      const textarea = document.createElement("textarea");
      textarea.value = outputRef.current.textContent || "";
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      setCopyButtonText("Copied ✓");
      setCopyButtonDisabled(true);

      setTimeout(() => {
        setCopyButtonText("Copy");
        setCopyButtonDisabled(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-4">String Transformer</h1>
      <p className="text-center mb-8">
        Enter a string with parentheses and numbers, and this tool will
        transform it according to the defined format.
        <br />
        Example: "logo of beauty salon, (vector art:1.1), (graphic desig:1.1),
        (dynamic composition:1.4), (complementary colors:1.3)"
      </p>
      <div className="w-full max-w-3xl">
        <label htmlFor="input" className="block text-sm font-medium mb-1">
          Input String
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded"
        />
        <button
          onClick={handleSubmit}
          className="w-full mb-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Submit
        </button>
        <label htmlFor="output" className="block text-sm font-medium mb-1">
          Output String
        </label>
        <div
          id="output"
          ref={outputRef}
          className="w-full p-2 mb-2 bg-gray-700 text-white border border-gray-600 rounded whitespace-pre-wrap"
        >
          {output}
        </div>
        <button
          onClick={handleCopy}
          disabled={copyButtonDisabled}
          className={`w-full p-2 ${
            copyButtonDisabled ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
          } text-white font-semibold rounded`}
        >
          {copyButtonText}
        </button>
      </div>

      <a
        href="https://github.com/dredshep/prompthelpers"
        className="flex gap-4 mt-4 text-gray-300 hover:text-gray-500 fill-current"
      >
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5 9 5 9-5-9-5zm0 0v12M5 5h14M5 19h14"
          />
        </svg> */}
        <GithubLogo />
        <div>Github Source Code</div>
      </a>
    </div>
  );
}
