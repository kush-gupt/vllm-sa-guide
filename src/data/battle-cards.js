export const battleCards = [
  {
    versus: 'OpenAI / Cloud APIs',
    scenario: '"We\'re already using OpenAI (or Azure OpenAI, Bedrock, etc.) and it works fine."',
    howVllmDiffers: 'Cloud APIs are great for prototyping, but at production scale the per-token costs add up fast. vLLM on your own GPUs gives you predictable costs, full data control, and the ability to fine-tune or swap models without rewriting your app.<a href="#source-10">[10]</a>',
    keyDifferences: [
      'OpenAI-compatible API means zero code changes to switch',
      'Data never leaves your infrastructure',
      'No per-token metering: pay for hardware, not usage',
      'Fine-tune and serve custom models freely'
    ]
  },
  {
    versus: 'TensorRT-LLM',
    scenario: '"NVIDIA says TensorRT-LLM is the fastest option for our GPU fleet."',
    howVllmDiffers: 'TensorRT-LLM is optimized for NVIDIA hardware, but it locks you into a single vendor stack. vLLM delivers competitive throughput across NVIDIA, AMD, Intel, and more, with a faster release cycle and broader community.<a href="#source-3">[3]</a>',
    keyDifferences: [
      'Runs on NVIDIA, AMD, Intel, TPU, Gaudi, and more <a href="#source-10">[10]</a>',
      'Open-source with 2,000+ contributors and rapid iteration <a href="#source-10">[10]</a>',
      'Simpler deployment: no compilation step needed',
      'PagedAttention pioneered the efficient memory management others now follow <a href="#source-9">[9]</a>'
    ]
  },
  {
    versus: 'TGI (Hugging Face)',
    scenario: '"We use Hugging Face for everything, so TGI is the natural choice."',
    howVllmDiffers: 'TGI is familiar if you\'re already in the HF toolchain, but vLLM\'s PagedAttention and continuous batching deliver higher throughput and better GPU utilization at scale. Plus, vLLM loads the same Hugging Face models.<a href="#source-9">[9]</a>',
    keyDifferences: [
      'Same Hugging Face model hub, no model conversion needed',
      'Higher throughput under concurrent load (PagedAttention + continuous batching) <a href="#source-9">[9]</a>',
      'Richer parallelism options (TP, PP, DP, EP, CP) for larger models <a href="#source-12">[12]</a>',
      'Larger community and faster release cadence <a href="#source-10">[10]</a>'
    ]
  },
  {
    versus: 'Custom / DIY Stack',
    scenario: '"Our ML team built something custom and it works for now."',
    howVllmDiffers: 'Custom inference stacks work until traffic grows. vLLM handles the hard problems (memory management, request scheduling, multi-GPU scaling) so your team can focus on the application instead of the infrastructure.',
    keyDifferences: [
      'Continuous batching and PagedAttention are hard to build from scratch',
      'Production features: structured output, streaming, tool calling, multi-LoRA',
      'Active community means security patches and performance improvements arrive fast',
      'Enterprise support available through multiple vendors'
    ]
  }
];
