export const battleCards = [
  {
    versus: 'OpenAI / Cloud APIs',
    scenario: '"We\'re already using OpenAI (or Azure OpenAI, Bedrock, etc.) and it works fine."',
    howVllmDiffers: 'Provider APIs bill per token, so steady high-volume traffic can concentrate spend on inference charges. Self-hosted vLLM shifts cost to GPU capacity and operations you control, keeps prompts and completions on your network, and lets you swap models without rewriting every integration.<a href="#source-10">[10]</a>',
    keyDifferences: [
      'OpenAI-compatible server: point clients at your base URL and served model name; audit unsupported parameters and vendor-only features before cutover',
      'Data stays on your infrastructure when self-hosted',
      'Self-hosted spend is mainly GPU time, power, and ops, not cloud per-token metering',
      'Fine-tune and serve custom models without provider approval'
    ]
  },
  {
    versus: 'TensorRT-LLM',
    scenario: '"NVIDIA says TensorRT-LLM is the fastest option for our GPU fleet."',
    howVllmDiffers: 'TensorRT-LLM targets NVIDIA GPUs and the TensorRT build path. vLLM runs on NVIDIA, AMD, Intel, and several other accelerators, ships frequent releases, and lists thousands of GitHub contributors.<a href="#source-3">[3]</a>',
    keyDifferences: [
      'Runs on NVIDIA, AMD, Intel, TPU, Gaudi, and more <a href="#source-10">[10]</a>',
      'Open source with 2,000+ GitHub contributors and frequent releases <a href="#source-10">[10]</a>',
      'Typical vLLM path: load Hugging Face weights directly; TensorRT-LLM workflows often include a separate engine build step',
      'vLLM paper introduced PagedAttention for block-structured KV caches; other engines ship related cache layouts <a href="#source-9">[9]</a>'
    ]
  },
  {
    versus: 'SGLang',
    scenario: '"SGLang benchmarks look faster\u2009\u2014\u2009should we switch?"',
    howVllmDiffers: 'SGLang uses RadixAttention for token-level prefix caching and shows lower latency at low concurrency; vLLM scales to higher peak throughput under production-level concurrency and handles long contexts more efficiently. Performance depends on concurrency, model size, and context length\u2014both engines improve rapidly across releases. vLLM\'s broader accelerator ecosystem (NVIDIA, AMD, Intel, TPU, Gaudi, Trainium, Inferentia, Spyre, Metal), five parallelism modes (TP, PP, DP, EP, CP), and the largest open-source LLM-serving contributor base differentiate at production scale.<a href="#source-10">[10]</a>',
    keyDifferences: [
      'Broader accelerator ecosystem: both support NVIDIA, AMD, TPU, and Ascend NPU; vLLM adds Trainium, Inferentia, Spyre, and Metal plugins with no SGLang equivalent <a href="#source-10">[10]</a>',
      'Five parallelism modes (TP, PP, DP, EP, CP) for large-model multi-node deployments <a href="#source-12">[12]</a>',
      'Mature Kubernetes docs, Helm charts, and KServe integration for production ops <a href="#source-16">[16]</a>',
      'Both support speculative decoding, disaggregated prefill, and structured outputs'
    ]
  },
  {
    versus: 'Custom / DIY Stack',
    scenario: '"Our ML team built something custom and it works for now."',
    howVllmDiffers: 'In-house schedulers need sustained work on KV memory, batching, and multi-GPU execution. vLLM ships those layers behind an OpenAI-compatible server so your team spends time on prompts, evaluation, and product logic.',
    keyDifferences: [
      'Continuous batching and PagedAttention are non-trivial to reproduce and tune in-house',
      'Production-oriented features: structured output, streaming, tool calling, multi-LoRA',
      'Security and performance fixes arrive through reviewed releases; plan upgrades like any open-source dependency',
      'Enterprise support available through multiple vendors'
    ]
  }
];
