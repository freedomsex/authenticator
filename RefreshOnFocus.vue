<script>
export default {
  methods: {
    refresh() {
      this.$emit('refresh');
    },
  },
  created() {
    window.addEventListener('focus', this.refresh);
  },
  destroyed() {
    window.removeEventListener('focus', this.refresh);
  },
}
</script>
