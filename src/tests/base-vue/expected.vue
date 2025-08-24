<template>
  <div class="class" id="id" v-bind="bound" v-on="whatever" other="other"></div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {},
});
</script>

<style>
.test {
  color: red;
}
</style>
