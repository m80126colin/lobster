<template>
<div id="app" class="ui centered grid">
  <div class="twelve wide column">
    <router-view :store="store"></router-view>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'

window._ = _
window.$ = window.jQuery = $

require('semantic-ui-css/semantic.css')
require('semantic-ui-css/semantic.js')

export default {
  name: 'app',
  data() {
    return {
      store: {
        token:    '',
        check:    [],
        options:  [],
        problems: [],
        result:   []
      }
    }
  },
  created() {
    const app = this
    // events
    app.$root
    .$on('write_check',   app.writeCheck)
    .$on('upload_answer', app.uploadAnswer)
    //
    $.getJSON('/problem').done(data => {
      _.assign(app.store, data, {
        check: _.map(data.problems, prob => { return {} })
      })
    })
  },
  methods: {
    writeCheck(idx, data) {
      const app = this
      _.assign(app.store.check[idx], data)
    },
    uploadAnswer() {
      const app = this
      $.getJSON('/answer', {
        token: app.store.token,
        check: app.store.check
      }).done(data => {
        _.assign(app.store, {
          result: data
        })
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
