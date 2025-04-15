"use client";
import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {inputClasses, labelClasses, primaryButtonClasses, secondaryButtonClasses} from "./QuizConstants";

export default function AddNewQuestionForm() {
  const { toast } = useToast();
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validOptions = options
      .map(opt => opt.trim())
      .filter(opt => opt !== "");

    if (validOptions.length < 2) {
      toast({ title: "Add at least 2 options", variant: "destructive" });
      return;
    }

    if (!correctAnswer || !validOptions.includes(correctAnswer)) {
      toast({ title: "Select valid correct answer", variant: "destructive" });
      return;
    }

    const newQuestion = {
      id: Date.now().toString(),
      text: questionText.trim(),
      options: validOptions,
      correctAnswer
    };

    const event = new CustomEvent('addquestion', {
      detail: newQuestion,
      bubbles: true,
      composed: true
    });
    document.dispatchEvent(event);

    // Reset form
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="font-semibold text-base">Add New Question</h4>

      {/* Question Text */}
      <div>
        <label className={labelClasses}>Question Text</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="What is...?"
          className={`${inputClasses} w-full`}
        />
      </div>

      {/* Options & Correct Answer */}
      <fieldset className="space-y-3">
        <legend className={`${labelClasses} mb-1`}>Options</legend>
        {options.map((option, idx) => (
          <div key={`option-${idx}`} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className={`${inputClasses} flex-1 w-full`}
            />
            <label className="flex items-center space-x-1.5 cursor-pointer p-2">
              <input
                type="radio"
                name="correct-answer"
                value={option.trim()}
                checked={correctAnswer === option.trim() && option.trim() !== ""}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                disabled={option.trim() === ""}
                className="h-4 w-4"
              />
              <span className="text-xs">Correct</span>
            </label>
          </div>
        ))}
      </fieldset>

      <div className="pt-2">
        <button type="submit" className={`${secondaryButtonClasses}  px-4 py-2`}>
          Add Question
        </button>
      </div>
    </form>
  );
}
