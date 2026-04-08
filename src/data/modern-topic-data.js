export const modernTopicData = {
      disagg: {
        title: 'Disaggregated prefill / decode',
        what: 'Separate prompt ingestion and token streaming into different pools so compute-heavy prefill does not starve decode-sensitive traffic.',
        why: 'It gives operators another way to protect TTFT and smooth streaming when prompt-heavy traffic shares a cluster with interactive chat.',
        when: 'Prompt lengths are volatile, TTFT matters, or the team wants to scale prefill and decode independently.',
        source: '<a href="https://docs.vllm.ai/en/latest/examples/online_serving/disaggregated_prefill.html" target="_blank" rel="noopener">vLLM docs: Disaggregated Prefill</a>',
      },
      spec: {
        title: 'Speculative decoding',
        what: 'A smaller draft model or heuristic proposes multiple next tokens, and the target model verifies them in parallel.',
        why: 'When draft quality is high enough, the expensive model approves several tokens at once instead of advancing one-by-one.',
        when: 'Interactive workloads are latency-sensitive and the team is willing to trade extra complexity for lower wall-clock latency.',
        source: '<a href="https://docs.vllm.ai/en/features/speculative_decoding/" target="_blank" rel="noopener">vLLM docs: Speculative Decoding</a>',
      },
      parallel: {
        title: 'MoE, context, and expert parallelism',
        what: 'Large sparse models need expert-aware execution, while long-context workloads increasingly need context-aware partitioning in addition to classic tensor and pipeline parallelism.',
        why: 'Model fit is no longer the only question. Interconnect, routing overhead, and KV movement become the main concerns at scale.',
        when: 'Teams are evaluating Mixtral or DeepSeek-style MoE models, or context length itself is part of the product promise.',
        source: '<a href="https://engineering.fb.com/2025/10/17/ai-research/scaling-llm-inference-innovations-tensor-parallelism-context-parallelism-expert-parallelism/" target="_blank" rel="noopener">Engineering at Meta: TP, CP, and EP</a>',
      },
      multimodal: {
        title: 'Multimodal serving',
        what: 'Inference now includes vision or audio encoders, multimodal preprocessing, and larger prefill footprints before the decoder even starts streaming text.',
        why: 'Image patches, audio frames, and OCR pipelines change prompt cost, memory pressure, and batching behavior long before token generation begins.',
        when: 'The solution includes screenshots, scanned documents, video frames, or agent workflows that mix language with visual context.',
        source: '<a href="https://docs.vllm.ai/en/design/mm_processing/" target="_blank" rel="noopener">vLLM design docs: Multi-Modal Data Processing</a>',
      },
      structured: {
        title: 'Structured outputs and tool use',
        what: 'Schemas, grammars, and function-calling contracts turn “respond with JSON” into a runtime feature instead of a prompt hope.',
        why: 'Structured output improves downstream reliability, but it also increases prompt scaffolding and can add decode-time constraints.',
        when: 'The application is chaining tools, populating forms, or handing model output directly to another system.',
        source: '<a href="https://platform.openai.com/docs/guides/structured-outputs/" target="_blank" rel="noopener">OpenAI docs: Structured model outputs</a>',
      },
      observe: {
        title: 'Observability and benchmarking',
        what: 'Teams instrument TTFT, inter-token latency, token counts, queue depth, and cache effectiveness instead of relying on a single tokens-per-second number.',
        why: 'Streaming UX, cache state, and arrival patterns can change perceived performance, so apples-to-apples benchmarking needs better measurement discipline.',
        when: 'Multiple teams or vendors are comparing engines, or production owners need to explain latency regressions under real traffic.',
        source: '<a href="https://opentelemetry.io/docs/specs/semconv/gen-ai/" target="_blank" rel="noopener">OpenTelemetry GenAI semantic conventions</a> and <a href="https://www.ietf.org/archive/id/draft-gaikwad-llm-benchmarking-methodology-00.html" target="_blank" rel="noopener">IETF benchmarking methodology</a>',
      },
    };
