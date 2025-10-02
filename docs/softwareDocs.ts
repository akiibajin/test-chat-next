export const softwareDocs = [
  {
    id: "arch-01",
    topic: "architecture",
    source: "internal:architecture",
    text: "Software architecture defines high-level structure, enforcing boundaries that preserve modularity, scalability, and maintainability.",
  },
  {
    id: "testing-01",
    topic: "testing",
    source: "internal:testing",
    text: "A healthy test pyramid has abundant fast unit tests, fewer integration tests, and minimal end-to-end tests focused on critical flows.",
  },
  {
    id: "perf-01",
    topic: "performance",
    source: "internal:performance",
    text: "Optimize only after measuring. Use profiling to locate bottlenecks; prefer algorithmic improvements over premature micro-optimizations.",
  },
  {
    id: "security-01",
    topic: "security",
    source: "internal:security",
    text: "Apply least privilege, validate all inputs, keep dependencies patched, and perform regular threat modeling reviews.",
  },
  {
    id: "code-review-01",
    topic: "code-review",
    source: "internal:code-review",
    text: "Effective code reviews balance correctness, clarity, testing, and security while giving concise, respectful feedback.",
  },
];
