<template>
<div id="index" :class="`ui center aligned ${isAvailable()} segment`">
  <router-link to="/prob/1" class="ui green button">開始作答</router-link>
</div>
</template>

<script>
export default {
  name: 'index',
  props: [ 'store' ],
  data() {
    return {
      loading: 1
    }
  },
  created() {
    const app = this
    app.$root.$emit('get_problem', () => {
      app.loading = 0
    })
  },
  methods: {
    /**
     *  Check whether store.problems is loaded
     */
    isAvailable() {
      if (this.loading)
        return 'loading'
      return ''
    }
  }
}
</script>