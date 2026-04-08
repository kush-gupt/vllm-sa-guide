export const strategies = {
      tp: {
        title: 'Tensor Parallelism',
        summary: 'Split each layer across GPUs when the model fits on one node but not on one device.',
        best: 'Single node, fast interconnect, latency-sensitive serving',
        tradeoff: 'More collective communication per forward pass',
        combo: 'Quantization or PP when the model still does not fit on one node',
        flag: '--tensor-parallel-size N',
        caution: 'Watch all-reduce overhead and keep TP within a strong node-level fabric.',
        visual: [
          {
            label: 'Request',
            nodes: [{ title: 'Prompt batch', detail: 'One full batch enters the engine' }],
          },
          {
            label: 'GPU shards',
            nodes: [
              { title: 'GPU 0', detail: 'Layer slice', highlight: true },
              { title: 'GPU 1', detail: 'Layer slice', highlight: true },
              { title: 'GPU 2', detail: 'Layer slice', highlight: true },
              { title: 'GPU 3', detail: 'Layer slice', highlight: true },
            ],
          },
          {
            label: 'Sync',
            nodes: [{ title: 'All-reduce', detail: 'Merge activations before next layer' }],
          },
        ],
      },
      pp: {
        title: 'Pipeline Parallelism',
        summary: 'Split the model into stage groups when one node is not enough and you need to stretch across more GPUs or nodes.',
        best: 'Very large models, multi-node scale-out, memory-driven topology',
        tradeoff: 'Pipeline bubbles and more stage management',
        combo: 'Usually paired with TP inside each stage',
        flag: '--pipeline-parallel-size M',
        caution: 'Keep stage balance tight or one slow stage drags the whole pipeline.',
        visual: [
          {
            label: 'Ingress',
            nodes: [{ title: 'Micro-batches', detail: 'Prompt stream enters stage queue' }],
          },
          {
            label: 'Stages',
            nodes: [
              { title: 'Stage 0', detail: 'Embeddings + early layers', highlight: true },
              { title: 'Stage 1', detail: 'Middle transformer stack', highlight: true },
              { title: 'Stage 2', detail: 'Late layers + head', highlight: true },
            ],
          },
          {
            label: 'Output',
            nodes: [{ title: 'Stream tokens', detail: 'Outputs return after the pipeline drains' }],
          },
        ],
      },
      dp: {
        title: 'Data Parallelism',
        summary: 'Replicate the model and scale throughput by letting multiple engine replicas serve different request subsets.',
        best: 'Throughput scaling when the model already fits comfortably',
        tradeoff: 'Higher aggregate memory footprint because each replica owns a full copy',
        combo: 'A common outer layer wrapped around TP or PP groups',
        flag: '--data-parallel-size R',
        caution: 'DP helps queue depth, but every replica still needs enough local KV and weights.',
        visual: [
          {
            label: 'Ingress router',
            nodes: [{ title: 'Request router', detail: 'Distributes traffic across replicas' }],
          },
          {
            label: 'Replicas',
            nodes: [
              { title: 'Replica A', detail: 'Full model copy', highlight: true },
              { title: 'Replica B', detail: 'Full model copy', highlight: true },
              { title: 'Replica C', detail: 'Full model copy', highlight: true },
            ],
          },
          {
            label: 'Outcome',
            nodes: [{ title: 'More throughput', detail: 'Shorter queues and flatter burst behavior' }],
          },
        ],
      },
      ep: {
        title: 'Expert Parallelism',
        summary: 'Distribute MoE experts across devices so the dense trunk stays shared while routed expert work fans out.',
        best: 'Sparse MoE families such as Mixtral or DeepSeek',
        tradeoff: 'Router decisions and expert load balance become the main concerns',
        combo: 'Pairs with DP and sometimes TP around the dense layers',
        flag: '--enable-expert-parallel',
        caution: 'The win depends on expert routing quality and keeping hot experts from becoming bottlenecks.',
        visual: [
          {
            label: 'Tokens',
            nodes: [{ title: 'Token groups', detail: 'Incoming tokens are routed by the MoE gate' }],
          },
          {
            label: 'Router',
            nodes: [{ title: 'MoE router', detail: 'Chooses the active experts', highlight: true }],
          },
          {
            label: 'Experts',
            nodes: [
              { title: 'Expert 0', detail: 'GPU-local specialist', highlight: true },
              { title: 'Expert 1', detail: 'GPU-local specialist', highlight: true },
              { title: 'Expert 2', detail: 'GPU-local specialist', highlight: true },
              { title: 'Expert 3', detail: 'GPU-local specialist', highlight: true },
            ],
          },
        ],
      },
      cp: {
        title: 'Context Parallelism',
        summary: 'Split a very long context across devices when the sequence length itself becomes the dominant scaling problem. Prefill CP and decode CP have different topologies.',
        best: 'Extreme context windows where a single device cannot comfortably hold the full sequence state',
        tradeoff: 'More coordination around sequence partitioning and KV movement; decode CP shards within the TP group rather than adding GPUs',
        combo: 'Often paired with TP/DP in long-context serving stacks',
        flag: '--prefill-context-parallel-size K --decode-context-parallel-size J',
        caution: 'Prefill CP adds GPUs; decode CP (-dcp / --decode-context-parallel-size) shards KV inside the TP group without extra devices. See context_parallel_deployment for bounds and topology.',
        visual: [
          {
            label: 'Context slices',
            nodes: [
              { title: 'Slice 0', detail: 'Front of context', highlight: true },
              { title: 'Slice 1', detail: 'Middle context', highlight: true },
              { title: 'Slice 2', detail: 'Tail context', highlight: true },
            ],
          },
          {
            label: 'Exchange',
            nodes: [{ title: 'KV coordination', detail: 'Share the right state for attention across slices' }],
          },
          {
            label: 'Decode',
            nodes: [{ title: 'Long-context decode', detail: 'Serve windows that exceed one-device comfort' }],
          },
        ],
      },
    };
