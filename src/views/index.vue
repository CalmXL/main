<template>
  <div class="Home">
    <!-- <WujieVue class="microRoot" name="rag" url="http://localhost:5173/" /> -->
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'Home',
  data() {
    return {}
  },
  computed: {},
  mounted() {
  },
  methods: {}
})
</script>

<style lang="scss" scoped>
.Home {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .microRoot {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
