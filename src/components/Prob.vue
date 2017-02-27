<template>
<div id="prob" class="ui segment">
<div class="ui grid">
  <div class="eight wide column">
    <img class="ui image" :src="`./static/${prob.source}`">
  </div>
  <div class="eight wide column segments">
    <div class="ui right aligned basic segment">
      <div class="ui statistic">
        <div class="value">{{ `${showId}/${store.problems.length}` }}</div>
      </div>
    </div>
    <div class="ui form basic segment">
      <div class="grouped fields">
        <div class="field" v-for="s in prob.selections">
        <div class="ui radio checkbox">
          <input type="radio"
            :name="idx"
            :value="s"
            v-model="select"
            @change="updateSelect">
          <label>{{ store.options[s] }}</label>
        </div>
        </div>
      </div>
    </div>
    <div v-show="select >= 0" class="ui right aligned basic segment">
      <router-link
        v-if="showId < store.problems.length"
        :to="`/prob/${showId + 1}`"
        class="ui basic blue button">下一題</router-link>
      <router-link
        v-else
        to="/end"
        class="ui basic green button">結束</router-link>
    </div>
  </div>
</div>
</div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'

window.moment = moment

const myDate = () => moment(new Date()).format('hh:mm:ss.SSS')

export default {
  name: 'prob',
  props: [ 'store' ],
  data() {
    return {
      select: -1
    }
  },
  mounted() {
    this.updateData()
  },
  watch: {
    '$route' (to, from) {
      this.updateData()
    }
  },
  computed: {
    showId() {
      return parseInt(this.$route.params.id)
    },
    idx() {
      return this.showId - 1
    },
    prob() {
      const app = this
      return app.store.problems[app.idx]
    }
  },
  methods: {
    updateData() {
      const app = this
      _.assign(app.$data, {
        select: -1,
        start:  myDate(),
        end:    ''
      })
    },
    updateSelect(e) {
      const app = this
      _.assign(app.$data, { end: myDate() })
      app.$root.$emit('write_check', app.idx, app.$data)
    }
  }
}
</script>