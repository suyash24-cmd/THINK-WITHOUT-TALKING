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
    id: "dehghani2019",
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
    id: "zhu2025",
    authors: "Zhu, R.-J., et al.",
    title: "A Survey on Latent Reasoning",
    year: 2025,
    venue: "arXiv:2507.06203",
    url: "https://arxiv.org/abs/2507.06203",
    relevantClaims: [
      "Latent reasoning carries multi-step inference in the model's continuous hidden state, removing token-level supervision",
      "Loop-based architectures (from the Universal Transformer onward) treat network depth as an adaptive computational resource",
    ],
  },
  {
    id: "hao2024",
    authors: "Hao, S., et al.",
    title: "Reasoning with Language Model is Planning with World Model",
    year: 2023,
    venue: "EMNLP (arXiv:2305.14992)",
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
    id: "bdh2024",
    authors: "DataForge 2026 Challenge Materials",
    title: "Beyond Chain-of-Thought (BDH & BDH-CQ) — Architecture Brief",
    year: 2026,
    venue: "Competition reference material",
    relevantClaims: [
      "BDH is specified as a gated recurrent latent-state reasoning architecture",
      "BDH-CQ extends BDH with a convergent-query halting mechanism",
      "Described from the challenge materials; cited and explained — never presented as an experiment we ran",
      "A public preprint link is not available to us; we do not fabricate one",
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
  {
    id: "frederick2005",
    authors: "Frederick, S.",
    title: "Cognitive Reflection and Decision Making",
    year: 2005,
    venue: "Journal of Economic Perspectives 19(4), 25–42",
    url: "https://www.aeaweb.org/articles?id=10.1257/089533005775196732",
    relevantClaims: [
      "The Cognitive Reflection Test measures willingness to override a fast, intuitive answer with deliberate reasoning",
      "High-performing samples often give the intuitive (wrong) answer at striking rates",
    ],
  },
  {
    id: "tversky1982",
    authors: "Tversky, A., & Kahneman, D.",
    title: "Evidential impact of base rates",
    year: 1982,
    venue: "In Judgment Under Uncertainty: Heuristics and Biases, Cambridge University Press",
    relevantClaims: [
      "People underweight base rates when vivid individuating evidence is present",
      "Bayesian combination of reliability and base rate raises the posterior of the rare event far less than people assume",
    ],
  },
];

export const getBdhCitations = () =>
  citations.filter((c) => ["bdh2024", "dehghani2019", "graves2016", "zhu2025"].includes(c.id));

export const getFoundationalCitations = () =>
  citations.filter((c) => ["wei2022", "yao2023", "hao2024", "frederick2005", "tversky1982"].includes(c.id));
