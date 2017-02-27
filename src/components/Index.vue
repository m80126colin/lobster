<template>
<div id="index" :class="`ui center aligned ${isAvailable()} segment`">
  <router-link to="/prob/1" class="ui green button">開始作答</router-link>
</div>
</template>

<script>
export default {
  name: 'index',
  props: [ 'store' ],
  methods: {
    isAvailable() {
      if (this.store.problems.length)
        return ''
      return 'loading'
    }
  }
}
</script>