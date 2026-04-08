export const objections = [
  {
    id: 'openai',
    objection: 'We already use Cloud APIs',
    response: 'Cloud APIs are excellent for getting started, but production-scale usage runs into unpredictable per-token costs, data leaving your perimeter, and no ability to fine-tune without their approval. vLLM gives you an OpenAI-compatible API that runs on your hardware. Swap the endpoint URL and your app keeps working.',
    keyPoints: [
      'Cost control at scale: GPU cost is fixed, not per-token',
      'Data sovereignty: prompts and responses stay in your environment',
      'Model flexibility: deploy any open model, fine-tune freely'
    ]
  },
  {
    id: 'gpu-expertise',
    objection: "We don't have GPU expertise",
    response: 'Kubernetes-native platforms like KServe wrap vLLM in a managed serving runtime, so platform teams deploy AI models the same way they deploy any other workload, using familiar Kubernetes tooling. Enterprise support is available through vendors such as Red Hat, Anyscale, and others.',
    keyPoints: [
      'KServe abstracts GPU infrastructure details',
      'Standard Kubernetes tooling for autoscaling and traffic routing',
      'Enterprise support available from multiple vendors'
    ]
  },
  {
    id: 'enterprise-support',
    objection: 'We need enterprise support',
    response: 'vLLM has multiple enterprise support options. Multiple vendors offer certified containers, vulnerability management, FIPS-compatible deployment options, and dedicated support, giving you the innovation speed of open source with production accountability.<a href="#source-10">[10]</a>',
    keyPoints: [
      'Certified container images with known provenance',
      'FIPS-compatible hashing and hardening guidance <a href="#source-10">[10]</a>',
      'Vulnerability management and security patching',
      'Dedicated support contacts for production issues'
    ]
  },
  {
    id: 'model-quality',
    objection: "Open-source model quality isn't there yet",
    response: 'Open models have closed the gap. Llama 3, Mistral, Qwen, and Granite families rival proprietary models on most enterprise tasks.<a href="#source-14">[14]</a> Multiple organizations publish optimized, quantized versions on Hugging Face that are tested and ready for production with vLLM.',
    keyPoints: [
      'Llama 3, Mistral, Qwen, Granite cover most enterprise use cases <a href="#source-14">[14]</a>',
      'Quantized models on Hugging Face, tested and optimized for vLLM',
      'Fine-tuning lets you exceed generic model quality on your domain',
      'Evaluate with your own data, not just public benchmarks'
    ]
  },
  {
    id: 'already-using',
    objection: "We're already using TGI / TensorRT-LLM",
    response: 'Both are solid choices, and migration is straightforward since vLLM supports the same models and APIs.<a href="#source-10">[10]</a> The typical reasons teams switch: better throughput under concurrent load, broader hardware support, or the need for features like disaggregated prefill, prefix caching, or expert parallelism.',
    keyPoints: [
      'Same Hugging Face models, same OpenAI-compatible API',
      'PagedAttention delivers better GPU memory utilization <a href="#source-9">[9]</a>',
      'Broader hardware support if the fleet isn\'t all-NVIDIA <a href="#source-10">[10]</a>',
      'Fastest-moving community with regular feature releases <a href="#source-10">[10]</a>'
    ]
  }
];
