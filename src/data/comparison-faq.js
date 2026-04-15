export const comparisonFaq = [
  {
    id: 'cloud-apis',
    question: 'We already use Cloud APIs - why self-host?',
    response:
      'Commercial APIs publish per-token pricing. Self-hosted vLLM changes that cost model: you pay for GPU capacity and operations you control, while keeping an OpenAI-compatible serving surface and choosing your own open-weight models.<a href="#source-31">[31]</a> <a href="#source-10">[10]</a>',
    keyPoints: [
      'OpenAI-compatible server: existing clients often only need a base URL and served model name change <a href="#source-10">[10]</a>',
      'Inference traffic can stay on infrastructure you control when you self-host; secure it with the reverse-proxy and network-isolation guidance in the security docs <a href="#source-28">[28]</a>',
      'Capacity cost, utilization, and operational overhead replace per-token provider billing in the cost model <a href="#source-21">[21]</a> <a href="#source-31">[31]</a>',
      'Supported-model coverage stays under your team\'s control rather than the provider catalog <a href="#source-14">[14]</a>',
    ]
  },
  {
    id: 'tensorrt',
    question: 'NVIDIA says TensorRT-LLM is the fastest option',
    response:
      'TensorRT-LLM is an NVIDIA-focused serving/runtime stack with detailed KV-cache controls and related optimizations. The vLLM project documents broader hardware coverage across its main repo and organization plugins, so the trade-off is usually specialized NVIDIA optimization versus broader portability and ecosystem fit.<a href="#source-3">[3]</a> <a href="#source-10">[10]</a>',
    keyPoints: [
      'The vLLM project documents support paths across CUDA, ROCm, Intel XPU, CPU, TPU, Neuron, Gaudi, Spyre, Metal, and more <a href="#source-10">[10]</a>',
      'TensorRT-LLM documentation emphasizes NVIDIA deployment and KV-cache optimization features <a href="#source-3">[3]</a>',
      'vLLM introduced PagedAttention; TensorRT-LLM also documents paged KV-cache and KV reuse techniques <a href="#source-9">[9]</a> <a href="#source-3">[3]</a>',
      'Choose based on your fleet, model mix, and whether you want a general-purpose serving layer or an NVIDIA-specialized stack',
    ]
  },
  {
    id: 'sglang',
    question: 'SGLang benchmarks look faster - should we switch?',
    response:
      'SGLang is another active open-source serving stack. Its project materials highlight RadixAttention, structured generation, and gateway/routing features; vLLM highlights broad hardware coverage, multiple parallelism modes, and a large serving ecosystem. The better fit depends on your models, hardware, and latency/throughput targets.<a href="#source-18">[18]</a> <a href="#source-10">[10]</a>',
    keyPoints: [
      'vLLM docs cover TP, PP, DP, EP, and CP for larger-model and long-context deployments <a href="#source-12">[12]</a>',
      'vLLM ships official KServe integration docs and a production-stack reference for Kubernetes deployments <a href="#source-16">[16]</a> <a href="#source-22">[22]</a>',
      'SGLang official materials emphasize RadixAttention and structured-generation ergonomics <a href="#source-18">[18]</a>',
      'Benchmark both stacks on your own workload before standardizing on one engine',
    ]
  },
  {
    id: 'gpu-expertise',
    question: "We don't have GPU expertise",
    response:
      'KServe documents running vLLM on Kubernetes through its Hugging Face serving runtime or through LLMInferenceService, so platform teams can reuse familiar rollouts, autoscaling, and traffic controls. Red Hat also documents vLLM-based deployment paths on OpenShift AI and related tooling for packaging and benchmarking.<a href="#source-16">[16]</a> <a href="#source-24">[24]</a>',
    keyPoints: [
      'KServe supports vLLM through the Hugging Face serving runtime and through LLMInferenceService <a href="#source-16">[16]</a>',
      'Standard Kubernetes patterns for autoscaling, routing, and health probes still apply to the serving workload',
      'OpenShift AI docs show packaging, deployment, and benchmarking workflows built around vLLM <a href="#source-24">[24]</a>',
    ]
  },
  {
    id: 'enterprise-support',
    question: 'We need enterprise support',
    response:
      'vLLM publishes security guidance for reverse proxies, network isolation, API-key limitations, and SSRF controls. Enterprise offerings come from vendors building on the project, including Red Hat AI Inference Server and OpenShift AI deployment workflows.<a href="#source-28">[28]</a> <a href="#source-24">[24]</a>',
    keyPoints: [
      'Do not rely on <code>--api-key</code> alone; the security guide explicitly recommends a reverse proxy and endpoint allowlisting <a href="#source-28">[28]</a>',
      'Network isolation and media-domain controls are part of the documented production hardening guidance <a href="#source-28">[28]</a>',
      'Red Hat documents packaging, deployment, and supportable workflows around vLLM-based serving <a href="#source-24">[24]</a>',
      'Treat enterprise support as a vendor decision layered on top of the upstream project',
    ]
  },
  {
    id: 'model-quality',
    question: "Open-source model quality isn't there yet",
    response:
      'Open-weight model quality now spans many production workloads, but the frontier still moves quickly by task and release. Artificial Analysis tracks steady progress in open models, and the vLLM supported-model docs show that current Llama, Qwen, Mistral, Granite, DeepSeek, and other families are directly serveable in vLLM.<a href="#source-19">[19]</a> <a href="#source-14">[14]</a> Benchmark on your own prompts, documents, and evaluation sets before standardizing.',
    keyPoints: [
      'Artificial Analysis tracks open-weight progress against proprietary systems over time <a href="#source-19">[19]</a>',
      'vLLM supported-model docs list current open-weight families across text, multimodal, and pooling tasks <a href="#source-14">[14]</a>',
      'Model quality should be validated on your domain data, not only on public leaderboards',
      'Open weights give you deployment and fine-tuning flexibility when your policy allows it',
      'Do not treat any single public leaderboard as a complete substitute for task-specific evaluation',
    ]
  },
];
