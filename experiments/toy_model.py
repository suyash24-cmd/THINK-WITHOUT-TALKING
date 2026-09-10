"""Reference template for the THINK WITHOUT TALKING toy model.

Reproduces the semantics described in the frontend narrative:

    input -> x -> h_0 -> tanh(W_r h_{t-1} + W_x x) -> ... -> h_T -> W_out h_T -> logits

No natural-language tokens are generated at any point. The reasoning budget
T and the hidden-state dimension are the two knobs swept by experiments.

STATUS: template. Run it after wiring in a dataloader for the parity/sequence
tasks. The export format below is the exact contract the web frontend reads.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

import torch
import torch.nn as nn


class LatentReasoner(nn.Module):
    """Toy latent recurrent reasoner (tanh-RNN with linear readout)."""

    def __init__(self, input_dim: int, state_dim: int, output_dim: int) -> None:
        super().__init__()
        self.state_dim = state_dim
        self.input_proj = nn.Linear(input_dim, state_dim)
        self.recur = nn.Linear(state_dim, state_dim)
        self.output_proj = nn.Linear(state_dim, output_dim)

    def forward(self, tokens: torch.Tensor, steps: int) -> torch.Tensor:
        h = torch.tanh(self.input_proj(tokens))
        for _ in range(steps):            # <- the latent "reasoning" loop
            h = torch.tanh(self.recur(h))
        return self.output_proj(h)


def train(
    model: nn.Module,
    batches: Iterable[tuple[torch.Tensor, torch.Tensor]],
    epochs: int = 200,
    lr: float = 1e-3,
) -> None:
    opt = torch.optim.Adam(model.parameters(), lr=lr)
    loss_fn = nn.CrossEntropyLoss()
    model.train()
    for epoch in range(epochs):
        for x, y in batches:
            logits = model(x, steps=5)
            loss = loss_fn(logits, y)
            opt.zero_grad()
            loss.backward()
            opt.step()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--epochs", type=int, default=200)
    parser.add_argument("--state-dim", choices=[16, 32, 64, 128], type=int, default=64)
    parser.add_argument("--task", default="parity_sum")
    parser.add_argument("--out", type=Path, default=Path("results/accuracy_by_steps.json"))
    args = parser.parse_args()

    # TODO(MLEngineer): replace with real dataloader for --task.
    model = LatentReasoner(input_dim=8, state_dim=args.state_dim, output_dim=2)

    # train(model, make_batches(args.task))

    # Contract shape the frontend adapter expects:
    points = [{"steps": t, "accuracy": 0.0, "std_dev": 0.0} for t in (1, 2, 3, 5, 8, 12, 20, 30)]
    results = {
        "experiment": "accuracy-vs-steps",
        "task": args.task,
        "model": "tanh_rnn",
        "state_dim": args.state_dim,
        "difficulty": "medium",
        "notes": "200 epochs, Adam lr=1e-3, batch 128",
        "points": points,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()