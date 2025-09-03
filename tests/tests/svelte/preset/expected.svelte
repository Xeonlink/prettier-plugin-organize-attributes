<script lang="ts">
  import type { Attachment } from "svelte/attachments";

  let count = 0;
  let def = "default";
  let rest = { id: "test" };
  let abc = "abc";
  let metaData = "meta";
  let color = "red";

  function handleChange(event: CustomEvent) {
    console.log(event.detail);
  }

  const test: Attachment = (target) => {
    target.appendChild(document.createElement("div"));
  };

  const fade = (node: Element, params?: { duration?: number }) => {
    return {
      duration: params?.duration || 300,
      css: (t: number) => `opacity: ${t}`,
    };
  };

  // Define a proper Svelte component for testing
  const Dummy = class {
    constructor(options: { target: any; props?: any }) {
      // Svelte component constructor
    }
    $$prop_def = {};
    $$events_def = {};
    $$slot_def = {};
    $on = (event: string, handler: Function) => () => {};
    $$bindings = {};
  };
</script>

<div style:--bg-color="red"></div>

<svelte:component
  this={Dummy}
  id="id"
  name="name"
  slot="slot"
  --style-props={color}
  style={{ "--bg-color": "red" }}
  class="large"
  bind:value={count}
  on:changeValue={handleChange}
  bind:metaData
  {def}
  data-foo
  {abc}
  {@attach test}
/>

<style lang="scss" scoped global type="text/css" media="screen">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: var(--primary-color, #f0f0f0);
  }

  .large {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-color, #333);
    transition: all 0.3s ease;
  }

  .large:hover {
    transform: scale(1.05);
    color: var(--hover-color, #007acc);
  }

  @media (max-width: 768px) {
    .container {
      padding: 10px;
    }

    .large {
      font-size: 1.2rem;
    }
  }
</style>
