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

/**
 *  Setup jQuery
 */
window.jQuery = window.$ = $

/**
 *  semantic UI theme
 */
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
    /**
     *  Setup events
     */
    app.$root
    .$on('write_check',   app.writeCheck)
    .$on('upload_answer', app.uploadAnswer)
    .$on('get_problem',   app.getProblem)
    /**
     *  Initialize problem data
     */
  },
  methods: {
    /**
     *  Modify a specified position of store.check
     *  @param {number} idx
     *  @param {json}   data
     */
    writeCheck(idx, data) {
      const app = this
      _.assign(app.store.check[idx], data)
    },
    /**
     *  Upload store.token and store.check to retrieve store.result
     */
    uploadAnswer() {
      const app = this
      $.getJSON('/answer',
        _.pick(app.store, 'token', 'check'))
      .done(data => {
        _.assign(app.store, { result: data })
      })
    },
    /**
     *  Initialize problem data
     */
    getProblem(cb) {
      const app = this
      $.getJSON('/problem').done(data => {
        _.assign(app.store, data, {
          check: _.map(data.problems, prob => { return {} })
        })
        cb()
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
