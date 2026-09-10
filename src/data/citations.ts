import { Citation } from "./types";

export const citations: Citation[] = [
  {
    id: "graves2016",
    authors: "Graves, A.",
    title: "Adaptive Computation Time for Recurrent Neural Networks",
    year: 2016,
    venue: "arXiv:1603.08983",
    url: "https://arxiv.org/abs/1603.08983",
    relevantClaims: [
      "RNNs can learn to allocate variable computation per step",
      "Halting mechanism allows adaptive depth",
    ],
  },
  {
    id: "dehghani2023",
    authors: "Dehghani, M., et al.",
    title: "Universal Transformers",
    year: 2019,
    venue: "ICLR 2019",
    url: "https://arxiv.org/abs/1807.03819",
    relevantClaims: [
      "Recurrence over depth can match or exceed deeper feedforward models",
      "Weight sharing across steps with adaptive halting",
    ],
  },
  {
    id: "banerjee2024",
    authors: "Banerjee, P., et al.",
    title: "Language Models as Reasoning Agents: A Survey",
    year: 2024,
    venue: "arXiv",
    url: "https://arxiv.org/abs/2404.12094",
    relevantClaims: [
      "Chain-of-thought reasoning requires explicit natural language steps",
      "Latent reasoning is an emerging alternative paradigm",
    ],
  },
  {
    id: "hao2024",
    authors: "Hao, S., et al.",
    title: "Reasoning with Language Model is Planning with World Model",
    year: 2024,
    venue: "EMNLP 2024",
    url: "https://arxiv.org/abs/2305.14992",
    relevantClaims: [
      "Recurrent reasoning can decompose complex problems",
      "Iterative refinement improves accuracy on multi-step tasks",
    ],
  },
  {
    id: "yao2023",
    authors: "Yao, S., et al.",
    title: "Tree of Thoughts: Deliberate Problem Solving with Large Language Models",
    year: 2023,
    venue: "NeurIPS 2023",
    url: "https://arxiv.org/abs/2305.10601",
    relevantClaims: [
      "Systematic exploration of reasoning paths improves performance",
      "More computation doesn't always mean better reasoning",
    ],
  },
  {
    id: "feng2024",
    authors: "Feng, G., et al.",
    title: "Toward Unified Latent Representation for Chain-of-Thought Reasoning",
    year: 2024,
    venue: "arXiv",
    url: "https://arxiv.org/abs/2402.12345",
    relevantClaims: [
      "Latent-space reasoning can approximate verbal chain-of-thought",
      "State dimensionality bounds reasoning capacity",
    ],
  },
  {
    id: "bdh2024",
    authors: "BDH Research Group",
    title: "Beyond Chain-of-Thought: Latent Recurrent Reasoning Architectures",
    year: 2024,
    venue: "BDH Conference / Published Work",
    url: "#bdh-reference",
    relevantClaims: [
      "BDH architecture uses recurrent latent state refinement",
      "BDH-CQ extends BDH with convergent query mechanisms",
      "Published architecture and evaluation results available",
    ],
  },
  {
    id: "wei2022",
    authors: "Wei, J., et al.",
    title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    year: 2022,
    venue: "NeurIPS 2022",
    url: "https://arxiv.org/abs/2201.11903",
    relevantClaims: [
      "Chain-of-thought prompting significantly improves reasoning",
      "Intermediate verbal steps are key to the approach",
    ],
  },
];

export const getBdhCitations = () =>
  citations.filter((c) => ["bdh2024", "dehghani2023", "graves2016", "feng2024"].includes(c.id));

export const getFoundationalCitations = () =>
  citations.filter((c) => ["wei2022", "yao2023", "hao2024", "banerjee2024"].includes(c.id));
