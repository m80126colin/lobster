<template>
<div id="app" class="ui centered grid">
  <div id="content" class="twelve wide column">
    <div v-if="init" class="ui segment">
      <div class="ui grid">
        <div class="eight wide column">
          <img class="ui image" :src="`./static/${problems[current][0]}`">
        </div>
        <div class="eight wide column">
          <div class="ui radio checkbox" v-for="s in problems[current][1]">
            <input type="radio" :name="current" :value="s">
            <label>{{ s }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'

window._ = _
window.$ = window.jQuery = $

const data = require('./assets/asset.csv')

require('semantic-ui-css/semantic.css')
require('semantic-ui-css/semantic.js')

export default {
  name: 'app',
  data() {
    return {
      init: false,
      current: 0,
      problems: []
    }
  },
  created() {
    let app = this
    const select = ['貓', '獵豹', '金魚']
    app.problems = _.map(data, (prob) => {
      return [
        prob[0],
        _(select).concat(prob[1]).shuffle().value()
      ]
    })
    app.init = true
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
