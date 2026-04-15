export const modernTopicData = {
  disagg: {
    title: 'Disaggregated prefill / decode',
    what: 'Run prefill and decode on separate vLLM instances and hand off KV cache so long prefills do not queue behind decode work.',
    why: 'Splitting tiers keeps long prefills from delaying decode batches that used to share the same serving workers.',
    when: 'Volatile prompt lengths, strict TTFT targets, or separate scale limits for prefill and decode. vLLM documents this path as experimental.',
    source: '<a href="https://docs.vllm.ai/en/latest/features/disagg_prefill/" target="_blank" rel="noopener">vLLM docs: Disaggregated Prefilling</a>',
  },
  spec: {
    title: 'Speculative decoding',
    what: 'A proposer (draft model, n-gram, EAGLE, MTP, or other supported method) emits candidate tokens; the target model verifies them with <abbr data-tip="The target model scores each draft token and keeps it only if it matches its distribution; otherwise it rejects and resamples.">rejection sampling</abbr>, which vLLM documents as lossless aside from float precision effects.',
    why: 'Each accepted bundle advances the sequence faster than one-token decoding; the vLLM speculative decoding guide highlights latency wins when <abbr data-tip="Queries per second: how many generation requests the server completes each second.">QPS</abbr> is medium to low and decode is memory-bound.',
    when: 'Latency-sensitive chat or streaming workloads where you can afford the extra proposer memory and tuning.',
    source: '<a href="https://docs.vllm.ai/en/latest/features/speculative_decoding/" target="_blank" rel="noopener">vLLM docs: Speculative Decoding</a>',
  },
  parallel: {
    title: 'MoE, context, and expert parallelism',
    what: 'MoE models need expert parallelism and low-latency <abbr data-tip="Collective where each device exchanges shards with every other device in one step. MoE layers use it to move tokens to the GPUs that host their experts.">all-to-all</abbr> token routing; very long contexts add context-parallel attention splits alongside tensor and pipeline sharding.',
    why: 'At scale, link bandwidth, routing, and KV movement often dominate after the model shards across devices.',
    when: 'Serving Mixtral- or DeepSeek-class MoE stacks, or offering context lengths that do not fit comfortably on one node.',
    source: '<a href="https://docs.vllm.ai/en/latest/serving/parallelism_scaling.html" target="_blank" rel="noopener">vLLM docs: Parallelism and Scaling</a>',
  },
  multimodal: {
    title: 'Multimodal serving',
    what: 'Serving adds vision or audio encoders, modality-specific preprocessing, and larger prefills before the text decoder streams tokens.',
    why: 'Image patches, audio frames, and OCR steps change prefill cost, memory use, and batching before generation starts.',
    when: 'Inputs include screenshots, scans, video frames, or agent flows that mix language with visual context.',
    source: '<a href="https://docs.vllm.ai/en/latest/design/mm_processing.html" target="_blank" rel="noopener">vLLM docs: Multi-Modal Data Processing</a>',
  },
  structured: {
    title: 'Structured outputs and tool use',
    what: 'JSON Schema, grammars, and tool contracts move "respond with JSON" from prompt wording into runtime constraints.',
    why: 'Structured output tightens downstream parsing, but the extra schema or grammar checks add serving-side work compared with unconstrained text generation.',
    when: 'Apps chain tools, fill forms, or pass model output straight into another system.',
    source: '<a href="https://docs.vllm.ai/en/latest/usage/structured_outputs.html" target="_blank" rel="noopener">vLLM docs: Structured Outputs</a> and <a href="https://platform.openai.com/docs/guides/structured-outputs/" target="_blank" rel="noopener">OpenAI docs: Structured model outputs</a>',
  },
  observe: {
    title: 'Observability and benchmarking',
    what: 'Instrument TTFT, inter-token latency, token counts, queue depth, and cache hit rate instead of tracking only aggregate tokens per second.',
    why: 'Streaming behavior, cache state, and arrival patterns change end-to-end latency; match prompts, hardware, and scheduler settings when comparing runs.',
    when: 'You are benchmarking vendors or engines, or you need to explain production latency shifts under real traffic.',
    source: '<a href="https://docs.vllm.ai/en/latest/usage/metrics.html" target="_blank" rel="noopener">vLLM docs: Production Metrics</a> and <a href="https://developers.redhat.com/articles/2026/03/03/practical-strategies-vllm-performance-tuning" target="_blank" rel="noopener">Red Hat: Practical strategies for vLLM performance tuning</a>',
  },
};
