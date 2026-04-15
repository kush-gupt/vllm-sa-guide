export const comparisonFaq = [
  {
    id: 'cloud-apis',
    question: 'We already use Cloud APIs — why self-host?',
    response: 'Provider APIs bill per token, so steady high-volume traffic can concentrate spend on inference charges. Self-hosted vLLM shifts cost to GPU capacity and operations you control, keeps prompts and completions on your network, and lets you swap models without rewriting every integration.<a href="#source-10">[10]</a>',
    keyPoints: [
      'OpenAI-compatible server: point clients at your base URL and served model name',
      'Data stays on your infrastructure — prompts and responses never leave your perimeter',
      'At scale, GPU capacity cost is often easier to cap than open-ended per-token bills',
      'Fine-tune and serve custom models without provider approval'
    ]
  },
  {
    id: 'tensorrt',
    question: 'NVIDIA says TensorRT-LLM is the fastest option',
    response: 'TensorRT-LLM targets NVIDIA GPUs and the TensorRT build path. vLLM runs on NVIDIA, AMD, Intel, and several other accelerators, ships frequent releases, and lists thousands of GitHub contributors. Typical vLLM path: load Hugging Face weights directly; TensorRT-LLM workflows often include a separate engine build step.<a href="#source-3">[3]</a>',
    keyPoints: [
      'Runs on NVIDIA, AMD, Intel, TPU, Gaudi, and more <a href="#source-10">[10]</a>',
      'Open source with 2,000+ GitHub contributors and frequent releases <a href="#source-10">[10]</a>',
      'Loads Hugging Face models directly — no separate TensorRT engine build for typical flows',
      'PagedAttention improves GPU memory utilization for batched KV state <a href="#source-9">[9]</a>'
    ]
  },
  {
    id: 'sglang',
    question: 'SGLang benchmarks look faster — should we switch?',
    response: 'SGLang uses RadixAttention for token-level prefix caching and shows lower latency at low concurrency; vLLM scales to higher peak throughput under production-level concurrency and handles long contexts more efficiently. Performance depends on concurrency, model size, and context length\u2014both engines improve rapidly across releases. vLLM\'s broader accelerator ecosystem (NVIDIA, AMD, Intel, TPU, Gaudi, Trainium, Inferentia, Spyre, Metal), five parallelism modes (TP, PP, DP, EP, CP), and the largest open-source LLM-serving contributor base differentiate at production scale.<a href="#source-10">[10]</a>',
    keyPoints: [
      'Broader accelerator ecosystem: both support NVIDIA, AMD, TPU, and Ascend NPU; vLLM adds Trainium, Inferentia, Spyre, and Metal plugins with no SGLang equivalent <a href="#source-10">[10]</a>',
      'Five parallelism modes (TP, PP, DP, EP, CP) for large-model multi-node deployments <a href="#source-12">[12]</a>',
      'Mature Kubernetes docs, Helm charts, and KServe integration for production ops <a href="#source-16">[16]</a>',
      'Both support speculative decoding, disaggregated prefill, and structured outputs'
    ]
  },
  {
    id: 'gpu-expertise',
    question: "We don't have GPU expertise",
    response: 'KServe documents running vLLM on Kubernetes through its Hugging Face serving runtime or through LLMInferenceService, so platform teams reuse familiar rollouts, autoscaling, and traffic rules. You still size GPU nodes, install drivers, and plan capacity. Red Hat (OpenShift AI) and Anyscale (managed Ray and vLLM guides) publish supported deployment paths and commercial offerings; other vendors do too.',
    keyPoints: [
      'KServe runs vLLM on Kubernetes through the Hugging Face serving runtime or LLMInferenceService',
      'Standard Kubernetes patterns for autoscaling and routing apply to the serving workload',
      'Commercial support is available from vendors including Red Hat (OpenShift AI) and Anyscale (Ray-based serving)'
    ]
  },
  {
    id: 'enterprise-support',
    question: 'We need enterprise support',
    response: 'vLLM has multiple enterprise support options. The community publishes container images with vulnerability management, FIPS-aware crypto paths (configurable multimodal hashing, TLS cipher control, FIPS-tolerant internal hashing), and hardening guidance. Production deployments need a reverse proxy, network segmentation, and secrets management around the engine. Vendors like Red Hat ship certified images, support contracts, and production accountability on top of the open-source project.<a href="#source-10">[10]</a> <a href="#source-28">[28]</a>',
    keyPoints: [
      'Community container images with vulnerability management; vendor-certified images available (e.g. Red Hat AI Inference Server)',
      'FIPS support: SHA-256/512 multimodal hashing, <code>--ssl-ciphers</code> for TLS, <code>usedforsecurity=False</code> on internal MD5 for FIPS-enabled hosts <a href="#source-10">[10]</a>',
      'Reverse proxy with endpoint allowlisting required; <code>--api-key</code> alone does not secure all endpoints <a href="#source-28">[28]</a>',
      'Dedicated support contacts for production issues'
    ]
  },
  {
    id: 'model-quality',
    question: "Open-source model quality isn't there yet",
    response: 'The gap has largely closed. The Artificial Analysis Intelligence Index shows open-weights models converging with proprietary over 2024\u20132026; on individual benchmarks like MMLU, HumanEval, and MATH the strongest open-weights models now match or exceed proprietary baselines.<a href="#source-19">[19]</a> Current-generation families\u2014Llama 4, DeepSeek V3.2/R2, Qwen 3.5, Gemma 4, Mistral, and IBM Granite\u2014cover chat, RAG, coding, math, and multilingual workloads, and all load directly in vLLM.<a href="#source-14">[14]</a> Benchmark them on your own prompts and documents before you standardize.',
    keyPoints: [
      'Benchmark convergence: the Artificial Analysis Intelligence Index shows open-weights models converging with proprietary over 2024\u20132026; on MMLU, HumanEval, and MATH the best open-weights models match or surpass proprietary offerings <a href="#source-19">[19]</a>',
      'Current model families all supported by vLLM: Llama 4 Maverick, DeepSeek R2, Gemma 4, Qwen 3.5, Mistral, IBM Granite <a href="#source-14">[14]</a>',
      'Self-hosted open-weights inference can run at substantially lower per-token cost than proprietary APIs, depending on utilization and workload',
      'Fine-tuning on domain data routinely outperforms generic frontier checkpoints, and open weights make this possible without vendor approval',
      'Evaluate with your own data, not only public leaderboards'
    ]
  }
];
