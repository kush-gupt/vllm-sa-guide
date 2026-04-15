export const objections = [
  {
    id: 'openai',
    objection: 'We already use Cloud APIs',
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
    id: 'gpu-expertise',
    objection: "We don't have GPU expertise",
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
    objection: 'We need enterprise support',
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
    objection: "Open-source model quality isn't there yet",
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
  {
    id: 'already-using',
    objection: "We're already using TGI / TensorRT-LLM",
    response:
      'Hugging Face documents TGI as maintenance mode and recommends vLLM, SGLang, llama.cpp, or MLX for new engine work. TensorRT-LLM remains a strong NVIDIA-specific option. Teams usually pick vLLM when they want OpenAI-compatible serving, broad hardware coverage, and documented parallelism/disaggregation paths.<a href="#source-20">[20]</a> <a href="#source-10">[10]</a> <a href="#source-12">[12]</a>',
    keyPoints: [
      'TGI is in maintenance mode and points users to newer engines including vLLM <a href="#source-20">[20]</a>',
      'TensorRT-LLM is specialized for NVIDIA deployments <a href="#source-3">[3]</a>',
      'vLLM covers broader hardware and organization-plugin support if your fleet is not all NVIDIA <a href="#source-10">[10]</a>',
      'Parallelism and disaggregated-prefill docs are published in the official serving guides <a href="#source-12">[12]</a> <a href="#source-2">[2]</a>',
    ]
  },
  {
    id: 'cost-savings',
    objection: 'How much will this actually save us?',
    response:
      'No universal savings number exists. The cost model shifts from per-token API billing to GPU capacity, utilization, and operational overhead you control. Use the TCO section plus GuideLLM and vLLM benchmarking to compute your own cost per million tokens or cost per request.<a href="#source-21">[21]</a> <a href="#source-23">[23]</a> <a href="#source-31">[31]</a>',
    keyPoints: [
      'Compare measured throughput against published API pricing, not against generic industry averages <a href="#source-21">[21]</a> <a href="#source-31">[31]</a>',
      'Prefix reuse, prompt length, and duty cycle change the economics as much as raw GPU price',
      'Operational overhead matters; include monitoring, upgrades, and support in the model <a href="#source-22">[22]</a> <a href="#source-24">[24]</a>',
      'Start with a representative pilot workload and use that measured output to size the production case',
    ]
  },
  {
    id: 'security-regulated',
    objection: 'Is this secure enough for regulated data?',
    response:
      'Self-hosting lets you keep inference traffic on infrastructure you control, but the default deployment still needs hardening. The security guide calls for reverse proxying, network isolation, and SSRF controls rather than assuming the out-of-the-box server is production-safe.<a href="#source-28">[28]</a>',
    keyPoints: [
      'Place vLLM behind a reverse proxy; <code>--api-key</code> does not protect every endpoint <a href="#source-28">[28]</a>',
      'Isolate inter-node traffic on trusted networks; multi-node communications are insecure by default <a href="#source-28">[28]</a>',
      'Restrict media-fetch domains to reduce SSRF risk <a href="#source-28">[28]</a>',
      'Use vendor workflows where needed for compliance, packaging, and support <a href="#source-24">[24]</a>',
    ]
  },
  {
    id: 'time-to-deploy',
    objection: 'How long does it take to get running?',
    response:
      'A local proof of concept can start with <code>vllm serve &lt;model&gt;</code>, and the official docs cover the path into Kubernetes-based deployments with KServe. The <a href="#adoption">Adoption Playbook</a> maps that progression into POC, pilot, and production phases.<a href="#source-10">[10]</a> <a href="#source-16">[16]</a>',
    keyPoints: [
      'Local: <code>vllm serve &lt;model&gt;</code> starts an OpenAI-compatible API server for initial evaluation <a href="#source-10">[10]</a>',
      'Kubernetes: KServe integration docs cover vLLM-based deployment patterns <a href="#source-16">[16]</a>',
      'OpenAI-compatible serving means many clients only need a base URL and model-name change <a href="#source-10">[10]</a>',
      'Full phased rollout plan in the <a href="#adoption">Adoption Playbook</a>',
    ]
  },
];
