<script>
import { toHumanString } from 'human-readable-numbers';

export default {
  props: ['ttl', 'lifetime', 'left', 'accent', 'minimum'],
  computed: {
    normal() {
      let value = this.accent || 30;
      return Number(this.ttl / 100).toFixed() * value;
    },
    warning() {
      let value = 100 - (this.minimum || 3);
      return 0 - Number(this.lifetime / 100).toFixed() * value;
    },

    readable() {
      return toHumanString(this.left);
    },

    color() {
      return {
        'badge-primary': this.left > this.normal,
        'badge-success': this.left < this.normal && this.left > 0,
        'badge-secondary': this.left < 0 && this.left > this.warning,
        'badge-warning': this.left < this.warning && this.left > 0 - this.lifetime,
        'badge-danger': this.left < 0 - this.lifetime,
      };
    },
  },
};
</script>

<template>
  <span class="color-ttl badge" :class="color" @click="$emit('refresh')">{{readable}}</span>
</template>

<style lang="less">
.color-ttl {
  color: white;

  &.badge {
    padding: 1px 5px;
    border-radius: 15px;

    &-primary {
      background-color: #337ab7;
    }
    &-success {
      background-color: #669933;
    }
    &-secondary {
      background-color: #999999;
    }
    &-warning {
      background-color: #FF6600;
    }
    &-danger {
      background-color: #ff3333;
    }
  }
}
</style>
