<script>
import expunix from 'expires-unixtime';

export default {
  props: ['token', 'auth', 'trigger', 'period'],
  watch: {
    token() {
      this.flash();
    },
  },
  data: () => ({
    left: 0,
    attempt: 0,
    available: false,
    expired: true,
    authorized: true,
    skipError: false,
    process: false,
  }),
  mounted() {
    this.verify();
    this.tick();
    window.setInterval(this.tick, this.period * 1000);
  },
  computed: {
    stopped() {
      return this.attempt > 2;
    },
    needed() {
      return this.left < this.trigger;
    },
    alert() {
      return (!this.authorized || this.expired) && (this.available && this.stopped);
    },
  },
  methods: {
    flash() {
      const {
        expires, refresh, created, lifetime,
      } = this.token;
      this.left = expires && expunix.left(expires); // 3600...0
      // Доступно обновление токена по refresh
      this.available = (refresh && !expunix.exceeded(created, lifetime));
      this.expired = !this.auth;
    },

    tick() {
      this.$emit('tick', this.left);
      this.flash();
      if (this.available) {
        if (this.needed && !this.stopped) {
          this.update();
        }
      }
    },

    verify() {
      if (!this.token.access) {
        this.update();
      }
    },

    reset() {
      this.attempt = 0;
      this.process = false;
      this.flash();
    },

    refresh() {
      this.reset();
      return this.update();
    },

    update() {
      this.process = true;
      this.attempt += 1;
      this.$emit('refresh');
    },

    unauthorize() {
      this.authorized = false;
    },
  },
};
</script>

<template></template>
