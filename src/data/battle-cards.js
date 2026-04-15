export const battleCards = [
  {
    versus: 'OpenAI / Cloud APIs',
    scenario: '"We\'re already using OpenAI (or Azure OpenAI, Bedrock, etc.) and it works fine."',
    howVllmDiffers:
      'Commercial APIs publish per-token pricing. Self-hosted vLLM changes that cost model: you pay for GPU capacity and operations you control, while keeping an OpenAI-compatible serving surface and choosing your own open-weight models.<a href="#source-31">[31]</a> <a href="#source-10">[10]</a>',
    keyDifferences: [
      'OpenAI-compatible server: existing clients often only need a base URL and served model name change <a href="#source-10">[10]</a>',
      'Inference traffic can stay on infrastructure you control when you self-host; secure it with the reverse-proxy and network-isolation guidance in the security docs <a href="#source-28">[28]</a>',
      'Capacity cost, utilization, and operational overhead replace per-token provider billing in the cost model <a href="#source-21">[21]</a> <a href="#source-31">[31]</a>',
      'Supported-model coverage stays under your team\'s control rather than the provider catalog <a href="#source-14">[14]</a>',
    ]
  },
  {
    versus: 'TensorRT-LLM',
    scenario: '"NVIDIA says TensorRT-LLM is the fastest option for our GPU fleet."',
    howVllmDiffers:
      'TensorRT-LLM is an NVIDIA-focused serving/runtime stack with detailed KV-cache controls and related optimizations. The vLLM project documents broader hardware coverage across its main repo and organization plugins, so the trade-off is usually specialized NVIDIA optimization versus broader portability and ecosystem fit.<a href="#source-3">[3]</a> <a href="#source-10">[10]</a>',
    keyDifferences: [
      'The vLLM project documents support paths across CUDA, ROCm, Intel XPU, CPU, TPU, Neuron, Gaudi, Spyre, Metal, and more <a href="#source-10">[10]</a>',
      'TensorRT-LLM documentation emphasizes NVIDIA deployment and KV-cache optimization features <a href="#source-3">[3]</a>',
      'vLLM introduced PagedAttention; TensorRT-LLM also documents paged KV-cache and KV reuse techniques <a href="#source-9">[9]</a> <a href="#source-3">[3]</a>',
      'Choose based on your fleet, model mix, and whether you want a general-purpose serving layer or an NVIDIA-specialized stack',
    ]
  },
  {
    versus: 'SGLang',
    scenario: '"SGLang benchmarks look faster - should we switch?"',
    howVllmDiffers:
      'SGLang is another active open-source serving stack. Its project materials highlight RadixAttention, structured generation, and gateway/routing features; vLLM highlights broad hardware coverage, multiple parallelism modes, and a large serving ecosystem. The better fit depends on your models, hardware, and latency/throughput targets.<a href="#source-18">[18]</a> <a href="#source-10">[10]</a>',
    keyDifferences: [
      'vLLM docs cover TP, PP, DP, EP, and CP for larger-model and long-context deployments <a href="#source-12">[12]</a>',
      'vLLM ships official KServe integration docs and a production-stack reference for Kubernetes deployments <a href="#source-16">[16]</a> <a href="#source-22">[22]</a>',
      'SGLang official materials emphasize RadixAttention and structured-generation ergonomics <a href="#source-18">[18]</a>',
      'Benchmark both stacks on your own workload before standardizing on one engine',
    ]
  },
  {
    versus: 'Custom / DIY Stack',
    scenario: '"Our ML team built something custom and it works for now."',
    howVllmDiffers:
      'In-house serving stacks still need to solve scheduling, KV-cache management, observability, security hardening, and multi-GPU scaling. vLLM exposes those capabilities behind documented APIs, deployment patterns, and hardening guidance so teams can focus more on model behavior and product integration.<a href="#source-10">[10]</a> <a href="#source-28">[28]</a>',
    keyDifferences: [
      'Continuous batching, prefix caching, and PagedAttention-style KV management are non-trivial systems work to reproduce and tune <a href="#source-9">[9]</a> <a href="#source-13">[13]</a>',
      'Production-facing features include OpenAI-compatible serving, structured outputs, multimodal paths, and LoRA support <a href="#source-10">[10]</a>',
      'The project publishes metrics, security guidance, and Kubernetes integration docs for production rollouts <a href="#source-25">[25]</a> <a href="#source-28">[28]</a> <a href="#source-16">[16]</a>',
      'Enterprise support can be layered on through vendors building on top of the upstream project <a href="#source-24">[24]</a>',
    ]
  },
];
