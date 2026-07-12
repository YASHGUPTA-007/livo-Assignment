export interface Script {
  id: string;
  title: string;
  text: string;
  difficulty: "Easy" | "Medium" | "Hard";
  /** Optional: target recording duration in seconds (used for AI-generated scripts) */
  targetSeconds?: number;
  wordCount?: number;
}

export const SCRIPTS: Script[] = [
  {
    id: "s1",
    title: "The Coffee Shop",
    difficulty: "Easy",
    text: "I went to the coffee shop this morning. The line was very long, but the smell of fresh coffee was amazing. I ordered a large cappuccino and a warm croissant. I sat by the window and watched people walking outside. It was a very peaceful start to my day.",
  },
  {
    id: "s2",
    title: "A Technology Article",
    difficulty: "Medium",
    text: "Artificial intelligence has rapidly transformed how we interact with technology. Today, machine learning algorithms can analyze vast amounts of data in seconds. From virtual assistants on our phones to complex autonomous vehicles on the road, these innovations are reshaping modern society and pushing the boundaries of what is possible.",
  },
  {
    id: "s3",
    title: "Scientific Research",
    difficulty: "Hard",
    text: "The phenomenon of quantum entanglement has perplexed physicists for decades. When two particles become entangled, their states are inexorably linked, regardless of the spatial distance separating them. This instantaneous correlation challenges our classical understanding of locality and continues to be a profound area of theoretical and experimental research.",
  }
];
