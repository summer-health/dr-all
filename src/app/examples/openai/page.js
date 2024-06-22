"use client";
import React from "react";

export default function OpenAI() {
  return (
    <div>
      <button
        onClick={async () => {
          const res = await fetch("/api/openai/completion", {
            method: "POST",
            body: JSON.stringify({
              messages: [{ role: "user", content: "Say this is a test" }],
            }),
          });
          const json = await res.json();
          console.log(json);
        }}
      >
        test
      </button>
    </div>
  );
}
