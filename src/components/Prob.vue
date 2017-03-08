<template>
<div id="prob" class="ui segment">
<div class="ui grid">
  <div class="twelve wide column">
    <img class="ui fluid rounded image" :src="`./static/${prob.source}`">
  </div>
  <div class="four wide column segments">
    <div class="ui right aligned basic segment">
      <div class="ui statistic">
        <div class="value">{{ `${showId}/${store.problems.length}` }}</div>
      </div>
    </div>
    <div class="ui massive form basic segment">
      <div class="grouped fields">
        <div class="field" v-for="s in prob.selections">
        <div class="ui large radio checkbox">
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
import _      from 'lodash'
import moment from 'moment'

const format = 'HH:mm:ss.SSS'
/**
 *  Return specified format of time
 *  @return {string}
 */
const myDate = () => moment(new Date()).format(format)

window.moment = moment

export default {
  name: 'prob',
  props: [ 'store' ],
  data() {
    return {
      select: -1
    }
  },
  /**
   *  Update data when mounted
   */
  mounted() {
    this.updateData()
  },
  watch: {
    /**
     *  Track dynamic routes and refresh data
     */
    '$route' (to, from) {
      this.updateData()
    }
  },
  computed: {
    /**
     *  Public Id
     */
    showId() {
      return parseInt(this.$route.params.id)
    },
    /**
     *  Index for store.problems and store.check
     */
    idx() {
      return this.showId - 1
    },
    /**
     *  Problem information for current index
     */
    prob() {
      const app = this
      return app.store.problems[app.idx]
    }
  },
  methods: {
    /**
     *  Refresh data
     */
    updateData() {
      const app = this
      _.assign(app.$data, {
        select: -1,
        start:  myDate(),
        end:    ''
      })
    },
    /**
     *  Emit 'write_check' event
     */
    updateSelect() {
      const app     = this
      const current = myDate()
      let diff = moment(current, format) - moment(app.$data.start, format)
      window.console.log(diff)
      if (diff < 0) diff += moment.duration(1, 'days')
      _.assign(app.$data, {
        end:  current,
        diff: moment.duration(diff).asSeconds()
      })
      app.$root.$emit('write_check', app.idx, app.$data)
    }
  }
}
</script>