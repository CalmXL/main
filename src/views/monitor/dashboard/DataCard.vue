<template>
  <div class="data-card">
    <div class="left-value">
      <div class="times"><span>{{ times }}</span>次</div>
      <div class="percent">
        环比<el-icon>
          <Top v-if="percent > 0" color="#FF0000" />
          <Bottom v-else color="#41C565" />
        </el-icon><span>{{ percent }}</span>%
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Top, Bottom } from '@element-plus/icons-vue'

const props = defineProps({
  times: Number,
  percent: {
    type: Number,
    require: true,
    default: () => 0
  }
})
</script>

<style lang="scss">
.data-card {
  box-sizing: border-box;
  padding: 30px 27px 20px 30px;
  display: flex;
  justify-content: space-between;

  .left-value {

    .times {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 42px;

      span {
        font-size: 34px;
        padding-right: 4px;
      }
    }

    .percent {
      display: flex;
      align-items: center;
      line-height: 22px;
      font-size: 14px;
    }
  }

}
</style>
