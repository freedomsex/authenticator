<script>
export default {
  created() {
    global.addEventListener('focus', this.$emit('refresh'));
  },
  destroyed() {
    global.removeEventListener('focus', this.$emit('refresh'));
  },
}
</script>