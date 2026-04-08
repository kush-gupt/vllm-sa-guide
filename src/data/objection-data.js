export const objections = [
  {
    id: 'openai',
    objection: 'We already use Cloud APIs',
    response: 'Cloud APIs meter by token, so cost tracks every request. Data leaves your perimeter unless you buy isolated endpoints. vLLM serves an OpenAI-compatible API on hardware you run; most clients only change base URL and model id.',
    keyPoints: [
      'At scale, GPU capacity cost is often easier to cap than open-ended per-token bills',
      'Data sovereignty: prompts and responses stay in your environment',
      'Model flexibility: deploy open weights and fine-tune without vendor sign-off'
    ]
  },
  {
    id: 'gpu-expertise',
    objection: "We don't have GPU expertise",
    response: 'KServe documents running vLLM on Kubernetes through its Hugging Face serving runtime or through LLMInferenceService, so platform teams reuse familiar rollouts, autoscaling, and traffic rules. You still size GPU nodes, install drivers, and plan capacity. Red Hat (OpenShift AI) and Anyscale (managed Ray and vLLM guides) publish supported deployment paths and commercial offerings; other vendors do too.',
    keyPoints: [
      'KServe runs vLLM on Kubernetes through the Hugging Face serving runtime or LLMInferenceService',
      'Standard Kubernetes patterns for autoscaling and routing apply to the serving workload',
      'Commercial support is available from vendors including Red Hat (OpenShift AI) and Anyscale (Ray-based serving)'
    ]
  },
  {
    id: 'enterprise-support',
    objection: 'We need enterprise support',
    response: 'vLLM has multiple enterprise support options. The community publishes container images with vulnerability management, configurable hashing (including FIPS-friendly algorithms for multimodal inputs), and hardening guidance. Vendors like Red Hat ship certified images, support contracts, and production accountability on top of the open-source project.<a href="#source-10">[10]</a>',
    keyPoints: [
      'Community container images with vulnerability management; vendor-certified images available (e.g. Red Hat AI Inference Server)',
      'FIPS-friendly hashing options (for example SHA-256 for multimodal content) and hardening guidance <a href="#source-10">[10]</a>',
      'Vulnerability management and security patching',
      'Dedicated support contacts for production issues'
    ]
  },
  {
    id: 'model-quality',
    objection: "Open-source model quality isn't there yet",
    response: 'Llama 3, Mistral, Qwen, and IBM Granite families are widely deployed for chat, RAG, and coding; benchmark them on your own prompts and documents before you standardize.<a href="#source-14">[14]</a> Many organizations publish quantized checkpoints on Hugging Face that target vLLM-supported formats.',
    keyPoints: [
      'Llama 3, Mistral, Qwen, and Granite are common enterprise baselines for chat, RAG, and internal tools <a href="#source-14">[14]</a>',
      'Quantized models on Hugging Face, tested and optimized for vLLM',
      'Fine-tuning can beat generic checkpoints on your domain',
      'Evaluate with your own data, not only public leaderboards'
    ]
  },
  {
    id: 'already-using',
    objection: "We're already using TGI / TensorRT-LLM",
    response: 'Both remain usable in their lanes. From TGI, migration is usually straightforward because vLLM loads the same Hugging Face checkpoints and serves an OpenAI-compatible API. From TensorRT-LLM, the main operational change is dropping the separate TensorRT engine build for models vLLM serves straight from weights.<a href="#source-10">[10]</a> Teams often switch for higher throughput under concurrency, hardware beyond NVIDIA-only fleets, or features such as disaggregated prefill, prefix caching, or expert parallelism.',
    keyPoints: [
      'Loads Hugging Face models directly, no TensorRT engine build for typical vLLM flows',
      'PagedAttention improves GPU memory utilization for batched KV state <a href="#source-9">[9]</a>',
      'Broader accelerator support if the fleet is not all NVIDIA <a href="#source-10">[10]</a>',
      'Large contributor base with frequent feature releases <a href="#source-10">[10]</a>'
    ]
  }
];
